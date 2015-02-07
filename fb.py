# These code snippets use an open-source library. http://unirest.io/python
import urllib, unirest, json
aa = urllib.quote_plus('http://www.espnfcasia.com/barclays-premier-league/story/2285519/angel-di-maria-house-attackedwanted-to-play-anywaysays-louis-van-gaal', '')
print aa
response = unirest.get("https://tldr.p.mashape.com/summary?url="+aa,
  headers={
    "X-Mashape-Key": "5bpS4Q46FamshdsZJcDkIEDsMFfpp16O31XjsnFZLErehUVRsG",
    "Accept": "application/json"
  }
)
print response.code # The HTTP status code
print response.headers # The HTTP headers
print response.body # The parsed response
print response.raw_body # The unparsed response