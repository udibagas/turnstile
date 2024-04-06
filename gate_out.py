#!/usr/bin/env python3
from evdev import InputDevice, categorize, ecodes, KeyEvent
import requests
import time
import threading
from serial import Serial

DEVICE = '/dev/input/event0'
SERIAL_DEVICE = '/dev/ttyUSB0'
SERIAL_BAUDRATE = 9600
OPEN_COMMAND = '*TRIG1#'
API_URL = 'http://192.168.1.97:3000/checkIn'


def checkIn(code):
    payload = {'code': code}

    try:
        r = requests.post(API_URL, json=payload, timeout=3)
        print(r.text)
        if r.status_code == 200:
            # TODO: open gate
            ser = Serial(SERIAL_DEVICE, SERIAL_BAUDRATE, timeout=1)
            ser.write(OPEN_COMMAND.encode())
            ser.close()
        else:
            # TODO: nyalakan led maybe?
            print('Failed')
            pass
    except Exception as e:
        print(e)
        time.sleep(2)


if __name__ == "__main__":
    device = InputDevice(DEVICE)
    code = ''

    for event in device.read_loop():
        if event.type == ecodes.EV_KEY and event.value == 1:
            key = KeyEvent(event)

            if key.keycode == 'KEY_ENTER':
                print(code)
                threading.Thread(target=checkIn, args=(code,)).start()
                code = ''

            code += chr(key.keycode)
