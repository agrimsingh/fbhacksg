http = require 'http'


getFile = (url, cb) ->
    if fileCache[url]?
        cb null, fileCache[url]
    else
        fs.readFile '.'+url, (err, html) ->
            fileCache[url] = html
            cb err, html

handleGet = (request, response) ->
    console.log "GET " + request.url
    urlParsed = url.parse request.url
    path = urlParsed['pathname']

    if path == '/waitforupdate'
        qs = querystring.parse urlParsed['query']
        clientSeqNo = Number qs['SeqNo']
        if clientSeqNo != seqNo
            observers.push [clientSeqNo, response]
            updateObservers()
        else
            observers.push [clientSeqNo, response]
            console.log "Observers: " + observers.length
        return

    if path == '/'
        path = '/main.html'
    getFile path, (err, html) ->
        if err?
            response.end()
        else
            response.writeHeader 200
            response.write html
            response.end()
        return

handlePost = (request, response) ->
    body = ''
    request.on 'data', (data) ->
        body += data
        if body.length > 100
            request.connection.destroy()
    request.on 'end', () ->
        console.log body
        parseInput body, response, ()->
            response.end()
        return

http.createServer (request, response) ->
    if request.method == 'GET'
        handleGet request, response

    if request.method == 'POST'
        handlePost request, response
.listen 8080
