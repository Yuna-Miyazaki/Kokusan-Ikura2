"""Build 済みのブラウザゲームを配信する、標準ライブラリだけのサーバー。"""

from __future__ import annotations

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
PORT = int(os.environ.get("PORT", "8000"))


class GameHandler(SimpleHTTPRequestHandler):
    """静的ファイルと SPA のフォールバックを配信する。"""

    def __init__(self, *args: object, **kwargs: object) -> None:
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self) -> None:  # noqa: N802 - stdlib API name
        request_path = urlparse(self.path).path.lstrip("/")
        target = DIST / request_path
        if request_path and not target.exists():
            self.path = "/index.html"
        super().do_GET()


def main() -> None:
    if not (DIST / "index.html").exists():
        raise SystemExit("dist がありません。先に `npm install && npm run build` を実行してください。")

    server = ThreadingHTTPServer(("127.0.0.1", PORT), GameHandler)
    print(f"名探偵の力加減: http://127.0.0.1:{PORT}")
    print("終了するには Ctrl+C")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nゲームを終了しました。")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
