"""
PyLab API Simplificada - Vers?o compat?vel
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime

class PyLabHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat(),
                "service": "PyLab API",
                "version": "2.0.0-simple",
                "message": "PyLab est? rodando! (vers?o simplificada)"
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif self.path == '/docs':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            html = """
            <html>
            <head><title>PyLab API - Documenta??o</title></head>
            <body>
                <h1>?? PyLab API</h1>
                <p>Status: <strong>Online</strong></p>
                <h2>Endpoints Dispon?veis:</h2>
                <ul>
                    <li>GET / - Health check</li>
                    <li>GET /health - Status do servi?o</li>
                    <li>GET /docs - Esta p?gina</li>
                </ul>
            </body>
            </html>
            """
            self.wfile.write(html.encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Log silencioso
        pass

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8002), PyLabHandler)
    print(f"?? PyLab rodando em http://0.0.0.0:8002")
    print(f"?? Documenta??o: http://localhost:8002/docs")
    server.serve_forever()
