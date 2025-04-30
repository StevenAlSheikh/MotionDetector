from fastapi import FastAPI, Request
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

class MotionEvent(BaseModel):
    motion: bool
    timestamp: datetime

@app.post("/motion")
async def receive_motion(data: MotionEvent):
    print(f"📡 Motion event received: {data.motion} at {data.timestamp}")
    # TODO: Save to database or trigger notification
    return {"status": "success", "received": data}
