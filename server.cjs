const http = require('http')
const fs   = require('fs')
const path = require('path')

const PORT = parseInt(process.env.PORT || '5173', 10)
const DIST = path.join(__dirname, 'dist')

console.log('=== Static server starting ===')
console.log('PORT:', PORT)
console.log('DIST:', DIST)
console.log('dist exists:', fs.existsSync(DIST))
console.log('Node version:', process.version)

if (!fs.existsSync(DIST)) {
  console.error('ERROR: dist/ directory not found at', DIST)
  console.error('Files in __dirname:', fs.readdirSync(__dirname).join(', '))
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0]
  let filePath = path.join(DIST, url === '/' ? 'index.html' : url)

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html')
  }

  const ext  = path.extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
    })
    res.end(data)
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`)
})
