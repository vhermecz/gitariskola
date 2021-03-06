import urllib.request
import xlrd3 as xlrd
import json
import re

DATA_URL = "http://www.musztydobay.hu/osszescsalidalexcel.xls"


def download_data(url):
    """Download data from URL and return in binary-string"""
    response = urllib.request.urlopen(url)
    data = response.read()
    return data


def extract_from_excel_blob(data):
    """Open binary blob xls and return data from first sheet in list of strings"""
    book = xlrd.open_workbook(file_contents = data)
    sh = book.sheet_by_index(0)
    for rx in range(sh.nrows):
        yield [cx.value for cx in sh.row(rx)]


def extract_chords(text):
    def splitter(texts, sep):
        presult = map(lambda x: x.split(sep), texts)
        return [item for sublist in presult for item in sublist]
    def cleanse_chordlist(text):
        text = re.split('-|\.', text)
        text = map(str.strip, text)
        text = map(str.lower, text)
        text = map(str.capitalize, text)
        text = list(filter(lambda x:x not in ['', 'Git'], text))
        return text
    text = [text.replace('–', '-').replace('…', '').upper()]
    text = splitter(text, "V.")
    text = splitter(text, "VAGY")
    text = splitter(text, "//")
    text = splitter(text, "GITISK")
    text = [cleanse_chordlist(item) for item in text]
    return text


def extract_pageref(text):
    result = []
    while text:
        index = text.find("-")
        book = text[0:index+1].strip("-")
        text = text[index+1:] if index > -1 else ""
        pages = []
        while True:
            full, page = re.match("(([^,.+]*)[,.+]*)", text).groups()
            if page:
                pages.append(page.lstrip("0"))
            text = text[len(full):]
            if not len(text) or not text[0].isdigit():
                break
        if pages:
            book = book.strip()
            if book == "C" or book.startswith("G"):
                book = "G"
            if book == "Cs":
                book = "Cs1"
            result.append(dict(
                book=book,
                pages=pages,
            ))
    return result


def convert_to_json_data(data):
    """Convert list of strings to json format"""
    if next(data) != ['Dal neve', 'Előadó', 'Könyv', 'Akkord', 'Akkord száma']:
        raise ValueError("Check input. Might be broken.")
    for idx, (title, performer, pageref, chords, _) in enumerate(data):
        chords = [i for i in extract_chords(chords) if i]
        pageref = extract_pageref(pageref)
        yield dict(
            idx=idx,
            title=title,
            performer=performer,
            pagerefs=pageref,
            chords=chords,
        )


def export_json(data, fname):
    """Export json data to file"""
    data = list(data)
    with open(fname, "w") as fp:
        fp.write("//Autogenerated do not modify\n\nexport const CHORDINFO = " + json.dumps(data, indent=4, sort_keys=True) + ";")


def main():
    data = download_data(DATA_URL)
    data = extract_from_excel_blob(data)
    data = convert_to_json_data(data)
    export_json(data, "../../src/config/chordinfo.js")


if __name__ == "__main__":
    main()
