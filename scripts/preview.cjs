// Servidor local limitado a los archivos públicos de la simulación.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pages = new Set(['inicio.html','coleccion.html','atelier.html','ayuda.html','index_simulacion.html','index_simulacion_home.html']);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  let name;
  try { name = decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'') || 'inicio.html'; }
  catch { res.writeHead(400); return res.end('URL inválida'); }
  if (name.includes('\\') || name.includes('\0') || name.split('/').some(s=>s.startsWith('.')) || !(pages.has(name) || /^sim(-intuitivo|-aviso-movil)?\//.test(name))) {
    res.writeHead(404); return res.end('No encontrado');
  }
  const file = path.resolve(root,name);
  fs.realpath(file,(err,real)=>{
    if (err || !real.startsWith(root+path.sep) || !types[path.extname(real)]) { res.writeHead(404);return res.end('No encontrado'); }
    fs.readFile(real,(error,data)=>{
      if(error) {res.writeHead(404);return res.end('No encontrado');}
      res.writeHead(200,{'Content-Type':types[path.extname(real)],'X-Content-Type-Options':'nosniff'});
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
});
server.listen(Number(process.env.PORT)||8765,'127.0.0.1');
