import uvicorn
from fastapi import FastAPI, WebSocket,WebSocketDisconnect
app = FastAPI()

# echo-client.py

import socket

HOST = ""  # The server's hostname or IP address
PORT = 2001  # The port used by the server

query_list = [49,99]

@app.websocket("/gobot")
async def test(websocket: WebSocket):
    await websocket.accept()
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    try: 
        while True:
            request = await websocket.receive_text()
            print(request)
            hex_data = bytes.fromhex(request)
            s.send(hex_data)
            if hex_data[1] in query_list:
                data = s.recv(1024)
                await websocket.send_text(data)
    except WebSocketDisconnect:
        print("Closed")
        s.close()
        

if __name__ == "__main__":
    uvicorn.run("app:app",host="0.0.0.0")