//add modules http, url, fs, path
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require("path")

//grab port from input otherwise use port 8000
const port = process.argv[2] || 8000

//file type map {}
const fileTypeMap = {
    '.ico'  : 'image/x-icon',
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
    '.css'  : 'text/css',
    '.png'  : 'image/png',
    '.jpeg' : 'image/jpeg',
    '.wav'  : 'audio/wav',
    '.mp3'  : 'audio/mpeg',
    '.svg'  : 'image/svg+xml',
    '.pdf'  : 'application/pdf',
    '.doc'  : 'application/msword',
    '.eot'  : 'application/vnd.ms-fontobject',
    '.ttf'  : 'application/font-sfnt'
}
//create sever

http.createServer(function(req, res){
    // console.log(`${req} and ${res}`)
    console.log(`${req.method} ${req.url}`)
    //parser url
    const parsedUrl = url.parse(req.url)
    // console.log('url: ', req.url);
    // console.log('parsedUlr: ', parsedUrl);
    //saniteze path
    let sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '')
    //path name
    let pathName = path.join(__dirname, sanitizePath)
    //check if path exist
    fs.exists(pathName, function(exist) {
        if(!exist){
            res.statusCode = 404
            res.end(`File ${pathName} was not found`)

            return
        }

        if(fs.statSync(pathName).isDirectory()) pathName += '/index.html'

        fs.readFile(pathName, function(err, data){
            if(err){
                res.statusCode = 500
                res.end('Error getting the file.')
                console.log(`Error getting the file (${pathName}). ${err}`)
            }

            const ext = path.parse(pathName).ext

            res.setHeader('Content-type', fileTypeMap[ext] || 'text/plain')
            res.end(data)
        })
        

    })
    //read file
        //throw err
        //extract date from file, parse path
        //set content type and send data
//don't forget to listen to port
}).listen(parseInt(port))

console.log(`Server is listening to port ${port}`)