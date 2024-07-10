import re, os.path

SEARCH_INDEX_PATH = "../js/search/before_2000/search_index.js"
ARCHIVE_PATH = "../../archiv"


def sanitize(s: str):
    while s.strip().startswith("<"):
        s = s[s.index(">") + 1:]

    escaped_chars = re.findall(r"&#(\d+);", s)
    for char in escaped_chars:
        if int(char) == 134:
            s = s.replace(f"&#{char};", "")
        else:
            s = s.replace(f"&#{char};", chr(int(char)))

    s = re.sub(r"\s\s+", " ", s)
    s = re.sub(r"^\d+[.,]\s*", "", s)
    s = s.replace("&uuml;", "ü").replace("&auml;", "ä").replace("&ouml;", "ö").replace("&Ouml;", "Ö")
    s = s.replace("&szlig;", "ß")
    s = s.replace("&eacute;", "é")
    s = s.strip()
    return s

    escaped_chars = re.findall(r"&#(\d+);", s)
    for char in escaped_chars:
        if int(char) == 134:
            s = s.replace(f"&#{char};", "")
        else:
            s = s.replace(f"&#{char};", chr(int(char)))

    s = re.sub(r"\s\s+", " ", s)
    s = re.sub(r"^\d+[.,]\s*", "", s)
    s = s.replace("&uuml;", "ü").replace("&auml;", "ä").replace("&ouml;", "ö").replace("&Ouml;", "Ö")
    s = s.replace("&szlig;", "ß")
    s = s.replace("&eacute;", "é")
    s = s.strip()
    return s


index = {}


def process(years, class_years, prefix):
    global index
    for year in range(*years):
        for class_year in range(*class_years):
            path = f"{ARCHIVE_PATH}/{year}/{prefix}{class_year}_{year}{year + 1}.htm"
            if not os.path.isfile(path):
                continue

            parts = re.split("<h3", open(path).read(), flags=re.IGNORECASE)[1:]
            for content in parts:
                title = re.findall(r"[^>]*>\s*([^<\r\n(]+)", content)[0]
                title = re.sub(r"klasse:?|kollegstufe| |m?ng", "", title.lower())

                names = re.findall(r'<(?:tr|TR)>\s*<(?:td|TD)(?![^>]* class="foto">)[^>]*>([^<]+(?:<FONT[^>]+>\s*)?(?:<P>[^<]+)?)', content)
                for name in names:
                    x = name
                    name = sanitize(name)
                    if name == "":
                        continue
                    if name not in index:
                        index[name] = {}
                    index[name][year] = title


process((53, 65), (1, 10), "0")
process((65, 99), (5, 14), "")

print("Found", len(index), "people.")

f = open(SEARCH_INDEX_PATH, "w", encoding="utf-8")
f.write("// Automatisch generiert.\n")
f.write("const search_index={")
first = True
for name in sorted(index):
    if not first:
        f.write(",")
    f.write(f'"{name}":' + "{")
    first2 = True
    for year in index[name]:
        if not first2:
            f.write(",")
        f.write(f'"{year}":"{index[name][year]}"')
        first2 = False
    f.write("}")
    first = False

f.write("};\n")
f.close()
