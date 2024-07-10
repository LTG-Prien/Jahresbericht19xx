#!/usr/bin/env python3

# Hey there.
# Falls ein PDF nicht klappt, wirst du vermutlich CLASS_REGEX_PART, create_visitor (liest den Text aus) oder try_parse (Parst den Text) bearbeiten wollen.
# Oder mach gleich alles neu, PDF-Parsing ist extrem instabil
# Oder stell DEBUG = True und mach den Rest per Hand, fix_classes.py macht dann das meiste und fix_class.py gegen die Fehler
#
# Falls sich irgendwer das Script wirklich durch liest: Ich trenne Titel / Klasse und Schüler anhand der Textgröße, das sollte das Verständnis leichter machen :D
# Bei Fragen: Discord "L3g7", Email contact@l3g7.dev

CLASS_REGEX_PART = "|".join([r"(?<=Klasse )\d+[a-e]", r"Q12 \d", r"Ukraine"])
DEBUG = True

from PyPDF2 import PdfReader, errors
import re, os, sys, json
from datetime import datetime

warn_count = 0
error_count = 0
reader = None

colors = {
    'green': '\033[92m',
    'yellow': '\033[93m' + '\033[1m',
    'red': '\033[91m' + '\033[1m',
    'reset': '\033[0m'
}

def info(*vargs):
    print("[" + colors['green'] + "INFO" + colors['reset'] + "]", *vargs)

def warn(*vargs):
    global warn_count
    warn_count += 1
    print("[" + colors['yellow'] + '' + "WARN" + colors['reset'] + "]", *vargs)

def error(*vargs):
    global error_count
    error_count += 1
    print("[" + colors['red'] + "ERROR" + colors['reset'] + "]", *vargs)

def supports_color():
    supported_platform = sys.platform != 'Pocket PC' and (sys.platform != 'win32' or 'ANSICON' in os.environ or ('COLORTERM' in os.environ and os.environ['COLORTERM'] == "truecolor") or "WT_SESSION" in os.environ)
    return supported_platform and hasattr(sys.stdout, 'isatty') and sys.stdout.isatty()

if not supports_color():
    colors = {'green':'','yellow':'','red':'','reset':''}

def create_visitor(texts_by_size):
    def visit(text, ct_matrix, text_matrix, font_dictionary, font_size):
        if not text.strip() or text.strip().isnumeric() or ".indd" in text or re.search(r"\d\d\.\d\d\.\d\d\d\d   \d+:\d+:\d+", text):
            # Leeren Text / Seitenzahl ignorieren
            return

        if text_matrix[0] != text_matrix[3]:
            # x-Scaling != y-Scaling
            warn("Text", repr(text), "hat eine ungleichmäßige Textgröße, Ergebnis kann fehlerhaft sein")

        size = text_matrix[0]
        if size not in texts_by_size:
            texts_by_size[size] = []

        for token in tokenize(text):
            texts_by_size[size].append([token, font_dictionary['/BaseFont']])

    return visit

def tokenize(text):
    raw_tokens = text.strip()
    raw_tokens = list(re.findall('[A-Z](?:[^A-Z]|(?<=-)[A-Z])*', raw_tokens))
    tokens = []
    idx = 0
    while idx < len(raw_tokens):
        token = ""
        while True:
            token += raw_tokens[idx]
            idx = idx + 1
            if not token.endswith(" "):
                while "  " in token:
                    token = token.replace("  ", " ")
                tokens.append(token)
                break

    return tokens

def try_parse(page, page_num, silent = False):
    texts_by_size = {}
    extracted_text = page.extract_text(visitor_text=create_visitor(texts_by_size))
    if (DEBUG):
        print(json.dumps(texts_by_size))
        return None

    # Sanity checks
    if len(texts_by_size) != 2:
        if not silent:
            warn("Auf Seite", page_num, "wurden", len(texts_by_size), "Textgrößen gefunden (2 erwartet), Ergebnis kann fehlerhaft sein")
            print(texts_by_size)

    for size, texts in texts_by_size.items():
        fonts = set()
        for text in texts:
            font = text[1]
            if "+" in font:
                font = font[font.index("+")+1:]
            fonts.add(font)
        if len(fonts) != 1:
            if not silent:
                warn("Auf Seite", page_num, "wurde die Textgröße", size, "mit mehreren Schriftarten (" + repr(fonts) + ") gefunden, Ergebnis kann fehlerhaft sein")

    if len(texts_by_size.items()) == 0:
        if not silent:
            error("Auf Seite", page_num, "konnte kein Text gefunden werden")
        return None

    # Textgruppe mit meisten Einträgen als Schülerliste nehmen
    size_with_most_entries = None
    entry_count = 0

    for k, v in texts_by_size.items():
        if entry_count < len(v):
            size_with_most_entries = k
            entry_count = len(v)

    pupils = list(map(lambda t: t[0], texts_by_size[size_with_most_entries]))

    # Größte Textgruppe als Klasse (Titel) nehmen
    for t3 in texts_by_size[sorted(texts_by_size.keys())[-1]]:
        title = t3[0].strip()
        res = re.match(r"^(?:.+ )?(?:(" + CLASS_REGEX_PART + r"))(?: .+)?$", title)

        if res is None or res[1] is None:
            continue
        break

    if res is None or res[1] is None:
        if not silent:
            error("Auf Seite", page_num, "konnte die Klasse nicht aus", repr(texts_by_size[sorted(texts_by_size.keys())[-1]]), "gelesen werden, bitte CLASS_REGEX_PART-RegEx im Script überarbeiten")
        return None
    return [res[1], pupils]

def generate_search_index(reader, start, end):
    results = []
    for i in range(start, end + 1):
        result = try_parse(reader.pages[i - 1], i)
        if result is None:
            continue
        if len(result[1]) < 5:
            warn("Auf Seite", i, "(Klasse " + repr(result[0]) + ") wurden", len(result[1]), "Schüler gefunden, Ergebnis kann fehlerhaft sein")

        results.append([result, i])

    return results

def find_suggestion(reader):
    if DEBUG:
        return [None, None]

    start_page = None
    end_page = None
    for i in range(0, len(reader.pages)):
        if re.match(r"\d+\s*Klassenübersicht|Klassenübersicht\s*\d+", reader.pages[i].extract_text()):
            if start_page is not None:
                # 2 Klassenübersichten gefunden, keinen Vorschlag anbieten
                start_page = None
                break

            start_page = i + 1
            if try_parse(reader.pages[i], i + 1, True) is None:
                start_page += 1
            continue

        if start_page is not None:
            res = try_parse(reader.pages[i], i + 1, True)
            if res is None:
                end_page = i
                break

    if end_page is None:
        # Kein Ende gefunden, keinen Vorschlag anbieten
        start_page = None
    if start_page is not None and end_page - start_page < 10:
        # Unter 10 Klassen gefunden, keinen Vorschlag anbieten
        start_page = None

    return [start_page, end_page]

def ask(question, validate, default = None):
    if default is not None:
        question += " (Standard " + str(default) + ")"
    try:
        while True:
            print(question + ":")
            res = input("> ")
            print("")
            if not res.strip() and default is not None:
                return default
            if validate(res.strip()):
                return res
    except KeyboardInterrupt:
        print("")
        sys.exit()

def check_pdf(path):
    global reader

    if path and path[0] == '"' and path[-1] == '"':
        path = path[1:-1]
    try:
        reader = PdfReader(path)
        return True
    except (FileNotFoundError, OSError):
        error("Datei wurde nicht gefunden.")
        return False
    except errors.PdfReadError as e:
        print(e)
        error("Datei konnte nicht als PDF geladen werden.")
        return False

def check_start_page(num):
    if not num.isnumeric():
        error("Ungültige Zahl.")
        return False
    num = int(num)
    if num < 0 or num >= len(reader.pages):
        error("Ungültige Seite.")
        return False

    return True

def check_end_page(num):
    if not num.isnumeric():
        error("Ungültige Zahl.")
        return False
    num = int(num)
    if num < start or num >= len(reader.pages):
        error("Ungültige Seite.")
        return False

    return True

def check_year(text):
    return re.match(r"^\d{4}-\d{4}$", text)

print("")
ask("Pfad zum PDF", check_pdf)

suggestion = find_suggestion(reader)
if suggestion[0] is None:
    warn("Klassenübersicht wurde nicht automatisch gefunden.")
else:
    info("PDF wurde geladen.")

start = int(ask("Startseite der Klassenübersicht, ohne Deckblatt", check_start_page, suggestion[0]))

end = int(ask("Endseite der Klassenübersicht, inklusive", check_end_page, suggestion[1]))

# year = datetime.now().year
# year = ask("Jahr", check_year, f"{year - 1}-{year}")

class_count = 0
pupil_count = 0
json_result = ""
for result0 in generate_search_index(reader, start, end):
    result = result0[0]
    page = result0[1]

    class_count += 1
    pupil_count += len(result[1])
    json_result += f'"{result[0]}":' + '{"page":' + str(page) + ',"pupils":' + str(result[1]).replace("'", '"').replace('", "', '","') + '},\n'

info(f"Ergebnis: {class_count} Klassen mit {pupil_count} Schülern gefunden. {warn_count} Warnungen, {error_count} Fehler.")
print(json_result)
