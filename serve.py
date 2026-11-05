"""Dev server with an /__edits endpoint: page edit-marks land in edits.jsonl."""
import json
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

EDITS = Path("edits.jsonl")


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if not self.path.startswith("/__edits"):
            self.send_error(404)
            return
        try:
            n = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            self.send_error(400)
            return
        data["ts"] = time.strftime("%Y-%m-%d %H:%M:%S")
        with EDITS.open("a", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False) + "\n")
        body = b'{"ok":true}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/__edits"):
            body = EDITS.read_bytes() if EDITS.exists() else b""
            self.send_response(200)
            self.send_header("Content-Type", "application/jsonl; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


if __name__ == "__main__":
    print("serving on http://127.0.0.1:8765  (edits -> edits.jsonl)")
    ThreadingHTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
