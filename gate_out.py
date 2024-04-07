#!/usr/bin/env python3
from evdev import InputDevice, ecodes, KeyEvent
import requests
import time
import threading
from serial import Serial

DEVICE = '/dev/input/event3'
SERIAL_DEVICE = '/dev/ttyUSB0'
SERIAL_BAUDRATE = 9600
OPEN_COMMAND = '*TRIG1#'
API_URL = 'http://10.5.50.99:3000/checkIn'


def checkIn(code):
    payload = {'code': code}

    try:
        r = requests.post(API_URL, json=payload, timeout=3)
        print(r.text)
        if r.status_code == 200:
            print('Valid code')
            ser = Serial(SERIAL_DEVICE, SERIAL_BAUDRATE, timeout=1)
            ser.write(OPEN_COMMAND.encode())
            ser.close()
        else:
            print('Invalid code')
    except Exception as e:
        print('Invalid code')
        time.sleep(2)


if __name__ == "__main__":

    device = InputDevice(DEVICE)
    code = ''

    for event in device.read_loop():
        if event.type == ecodes.EV_KEY and event.value == 1:
            key = KeyEvent(event)

            if len(code) == 36 or key.keycode == 'KEY_ENTER':
                print('Code: ', code)
                threading.Thread(target=checkIn, args=(code,)).start()
                code = ''

            if (key.keycode == 'KEY_MINUS'):
                code += '-'
            else:
                code += key.keycode[4:].lower()
