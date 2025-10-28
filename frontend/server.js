const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const BACKEND_URL = 'http://localhost:3000';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Proxy para peticiones a /api/*
    if (req.url.startsWith('/api/')) {
        console.log(`🔄 Proxy: ${req.method} ${req.url} -> ${BACKEND_URL}${req.url}`);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: req.url,
            method: req.method,
            headers: req.headers
        };

        const proxyReq = http.request(options, (proxyRes) => {
            // Copiar headers de la respuesta
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            
            // Pipe la respuesta
            proxyRes.pipe(res);
        });

        // Manejar errores del proxy
        proxyReq.on('error', (error) => {
            console.error(`❌ Error de proxy: ${error.message}`);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Error de conexión con el backend. Verifica que esté corriendo en http://localhost:3000',
                error: error.message
            }));
        });

        // Si hay body en la petición, enviarlo
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                proxyReq.write(body);
                proxyReq.end();
            });
        } else {
            proxyReq.end();
        }
        
        return;
    }

    // Servir archivos estáticos
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Obtener la extensión del archivo
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leer y servir el archivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Archivo no encontrado
                console.error(`404 - Archivo no encontrado: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                // Error del servidor
                console.error(`500 - Error del servidor: ${error.code}`);
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // Éxito
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Servidor Frontend Iniciado con Proxy                 ║
║                                                            ║
║   📍 Frontend: http://localhost:${PORT}                     ║
║   📍 Backend:  ${BACKEND_URL}                    ║
║                                                            ║
║   🔄 Proxy configurado:                                   ║
║      /api/* → ${BACKEND_URL}/api/*          ║
║                                                            ║
║   📄 Páginas disponibles:                                 ║
║      • http://localhost:${PORT}/index.html                  ║
║      • http://localhost:${PORT}/login.html                  ║
║      • http://localhost:${PORT}/dashboard.html              ║
║                                                            ║
║   ⚠️  IMPORTANTE: El backend debe estar corriendo en      ║
║      ${BACKEND_URL}                          ║
║                                                            ║
║   ⏹️  Presiona Ctrl+C para detener el servidor            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
