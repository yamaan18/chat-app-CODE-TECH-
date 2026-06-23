# LiveChat — Real-Time Chat Application

A clean, real-time chat application built with **Python FastAPI** (backend) and **vanilla HTML/CSS/JS** (frontend), connected via **WebSockets** for instant, bidirectional messaging.

---

## Project Overview

LiveChat allows multiple users to join a shared chat room and exchange messages instantly — no page refreshes required. Messages are broadcast to all connected users in real time using the WebSocket protocol.

This project was built as a Full Stack Development internship deliverable, demonstrating integration between a FastAPI WebSocket backend and a modern, responsive frontend.

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

### Optional: specify a custom host/port

```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

---

## How It Works

1. **User visits** `http://localhost:8000` and enters a username.
2. The browser opens a **WebSocket connection** to `/ws/{username}`.
3. The FastAPI server **accepts** the connection and adds it to the connection pool.
4. A **join notification** is broadcast to all connected users.
5. When a user types and sends a message, it is sent over the WebSocket to the server.
6. The server **broadcasts** the message (with the sender's username) to every connected client.
7. All clients **render** the message instantly without any page reload.
8. When a user leaves (closes the tab or clicks Leave), a **disconnect notification** is broadcast.

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

