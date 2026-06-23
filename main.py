from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List
import json

app = FastAPI(title="Real-Time Chat App")
app.mount("/static", StaticFiles(directory="static"), name="static")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        message_json = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception:
                pass

    def user_count(self):
        return len(self.active_connections)

manager = ConnectionManager()

@app.get("/")
async def get_index():
    return FileResponse("templates/index.html")

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    await manager.broadcast({"type": "system", "text": f"{username} has joined the chat.", "users": manager.user_count()})
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"type": "chat", "username": username, "text": data, "users": manager.user_count()})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"type": "system", "text": f"{username} has left the chat.", "users": manager.user_count()})