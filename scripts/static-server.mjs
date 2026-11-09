import http from 'http'
import fs from 'fs'
import path from 'path'

const root = process.argv[2]
const port = Number(process.argv[3] || 5180)
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2' }

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  let file = path.join(root, url === '/' ? 'index.html' : url)
  if (!file.startsWith(path.resolve(root))) { res.writeHead(403); return res.end() }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('404') }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size })
    fs.createReadStream(file).pipe(res)
  })
}).listen(port, () => console.log(`serving ${root} on :${port}`))
