import requests as req
from bs4 import BeautifulSoup as bs
import urllib

isBaseUrl = True

baseUrl = 'https://carsweek.ru'
url = 'https://carsweek.ru/photo/'
folder = '5'
imgUrls = []

r = req.get(url)
if r.status_code == 200:
    soup = bs(r.text, "html.parser")

    tags = soup.find_all('ul', class_='photos')
    tags = str(tags[0])
    soup2 = bs(tags, "html.parser")
    tags2 = soup2.find_all('img')
    tags = tags2
    if tags:
        for i in tags:
            imgUrls.append(i['src'])

        id = 0
        for i in imgUrls:
            try:
                url = (i, baseUrl + i)[bool(isBaseUrl)]
                res = urllib.request.urlopen(url)
                out = open(f'./src/res/{folder}/{folder}_{id}.png', 'wb')
                out.write(res.read())
                out.close()
                print('Downloaded: '+i)
                id += 1
            except:
                continue

        print()
        print('All have been downloaded')
    else:
        print(tags)

else:
    print('ERROR '+str(r.status_code))