const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const INDEX_PATH = path.resolve(__dirname, 'index.html');

const server = http.createServer((req, res) => {
    // Always serve index.html for root or html requests
    fs.readFile(INDEX_PATH, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Erro ao carregar o aplicativo.');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`--- APLICATIVO GERADOR MENSAL INDEPENDENTE RODANDO NA PORTA ${PORT} ---`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
