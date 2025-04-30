from gpiozero import MotionSensor
import httpx
from datetime import datetime
import time

pir = MotionSensor(4) 
API_URL = "http://192.168.0.183:8000/motion"  # IP Address

def send_motion_event():
    timestamp = datetime.now().isoformat()
    data = {
        "motion": True,
        "timestamp": timestamp
    }
    try:
        response = httpx.post(API_URL, json=data)
        print(f"✅ Motion event sent at {timestamp}, status: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send motion event: {e}")

print("🚀 Motion detection started...")
while True:
    pir.wait_for_motion()
    send_motion_event()
    pir.wait_for_no_motion()
    time.sleep(1)
