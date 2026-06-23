# LiveChat -> Real-Time Chat Application
## Demo Features

- Real-time multi-user chat
- WebSocket-based communication
- Online user tracking
- Join/leave notifications
- Responsive dark-themed UI

A clean, real-time chat application built with **Python FastAPI** (backend) and **vanilla HTML/CSS/JS** (frontend), connected via **WebSockets** for instant, bidirectional messaging.

---

## Project Overview

LiveChat allows multiple users to join a shared chat room and exchange messages instantly — no page refreshes required. Messages are broadcast to all connected users in real time using the WebSocket protocol.


---

## Features

- **Real-time messaging** — Messages appear instantly for all connected users
- **Username display** — Each message shows the sender's username
- **Join / Leave notifications** — The room announces when users connect or disconnect
- **Online user count** — Live counter of currently connected users
- **Responsive UI** — Works on desktop and mobile browsers
- **No page refresh** — Powered by WebSockets for seamless communication
- **Clean, professional design** — Dark-mode interface with a refined aesthetic

---

## Project Structure

```
Chat-App/
├── main.py              # FastAPI app — WebSocket server & HTTP routes
├── requirements.txt     # Python dependencies
├── static/
│   ├── style.css        # All UI styles (dark theme, responsive)
│   └── script.js        # WebSocket client logic
├── templates/
│   └── index.html       # Main HTML page (join screen + chat screen)
└── README.md            # This file
```

---

## Technologies Used

| Layer     | Technology               |
|-----------|--------------------------|
| Backend   | Python 3.9+, FastAPI     |
| WebSocket | FastAPI WebSocket, `websockets` library |
| Templates | Jinja2                   |
| Frontend  | HTML5, CSS3, JavaScript (ES6+) |
| Fonts     | Google Fonts (Syne, DM Sans) |
| Server    | Uvicorn (ASGI)           |

---

## Installation Steps

### 1. Prerequisites

Make sure you have **Python 3.9 or higher** installed:

```bash
python --version
```

### 2. Clone or Download the Project

```bash
# If using git:
git clone <your-repo-url>
cd Chat-App

# Or simply download and extract the ZIP, then:
cd Chat-App
```

### 3. Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS / Linux:
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Application

Start the FastAPI server with Uvicorn:

```bash
uvicorn main:app --reload
```

The server will start at:

```
http://127.0.0.1:8000
```

Open this URL in **two or more browser tabs** to simulate multiple users chatting in real time.



---



## How It Works

1. User enters a username and joins the chat.
2. A WebSocket connection is established with the FastAPI server.
3. Messages are broadcast to all connected users in real time.
4. Join/leave notifications and online user counts are updated automatically.

### WebSocket Message Format

The server sends JSON objects of two types:

```json
// Chat message
{
  "type": "chat",
  "username": "Harry",
  "text": "Hello everyone!",
  "users": 3
}

// System notification
{
  "type": "system",
  "text": "Rahul has joined the chat.",
  "users": 2
}
```

---

