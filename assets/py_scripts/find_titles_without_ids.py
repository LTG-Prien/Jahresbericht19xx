import re, os.path

SEARCH_INDEX_PATH = "../js/search/search_index.js"
ARCHIVE_PATH = "../../archiv"


data = []

def process(years, class_years, prefix):
    global data

    for year in range(*years):
        for class_year in range(*class_years):
            path = f"{ARCHIVE_PATH}/{year}/{prefix}{class_year}_{year}{year + 1}.htm"
            if not os.path.isfile(path):
                continue

            parts = open(path).read().split("<h3")[1:]
            for content in parts:
                if re.match(r'<h3 (align="center" |ALIGN="CENTER" |)id="(\d\d?[a-d]?|[kK] ?\d\d)">', "<h3" + content[:35]):
                    continue
                print(path, "<h3" + content[:35])
                title = re.findall(r"[^>]*>\s*([^<\r\n(]+)", content)[0]
                data.append(title)
                title = re.sub(r"klasse:?|kollegstufe| |m?ng", "", title.lower())



process((53, 65), (1, 10), "0")
print("--------")
process((65, 99), (5, 14), "")
print(list(dict.fromkeys(data)))
