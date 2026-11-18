# Petit serveur local temporaire : reçoit les illustrations générées (POST /save?name=xxx)
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import os, re
OUT = os.path.expanduser('~/Developer/clients/clapton-site/_source/illus')
os.makedirs(OUT, exist_ok=True)
class H(BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:4387')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
    def do_OPTIONS(self):
        self.send_response(204); self.cors(); self.end_headers()
    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        name = re.sub(r'[^a-z0-9-]', '', q.get('name', ['x'])[0])
        data = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        with open(os.path.join(OUT, name + '.png'), 'wb') as f: f.write(data)
        self.send_response(200); self.cors(); self.end_headers(); self.wfile.write(b'ok')
HTTPServer(('127.0.0.1', 4391), H).serve_forever()
