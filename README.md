<<<<<<< HEAD
# CodeSync - Real-Time Collaborative Code Editor
=======
# CodeSync - Real-Time Collaborative Coding Platform
>>>>>>> f0b1ec1b (Added README and project setup)

A web-based collaborative code editor that allows multiple users to write, edit, and execute code together in real-time.  
Perfect for **pair programming, technical interviews, and remote learning**, featuring live code sync, AI assistance, and multi-language execution.

## Features

* **Real-Time Collaboration** – Code, language selections, and user presence sync instantly with Socket.IO.  
* **Multi-Language Code Execution** – Run code in JavaScript, Python, C++, Java, and more using Judge0 API.  
* **AI-Powered Assistance** – Get bug fixes, feedback, and help with Google Gemini API integration.  
* **Live User Presence** – See who’s active in the room with live typing indicators.  
* **Room-Based Sessions** – Create unique rooms with shareable IDs for private sessions.  
* **Modern Editor Experience** – Monaco Editor for smooth, responsive coding.  

## Tech Stack

**Frontend (Client):**  
* React  
* Socket.IO Client  
* Axios  
* Monaco Editor  
* Deployment: Vercel  

**Backend (Server):**  
* Node.js & Express  
* Socket.IO  
* Google Gemini API  
* Judge0 RapidAPI  
* Deployment: Render  

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/Mukulpandey1612/CodeSync.git
```
### 2. Backend Setup
```bash
cd server
npm install
npm start
```
### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

### Screenshot
![App Screenshot](<client/public/image/Screenshot 2025-09-09 093114.png>)
![App Screenshot](<client/public/image/Screenshot 2025-09-09 093123.png>)
![App Screenshot](<client/public/image/Screenshot 2025-09-09 093336.png>)

### License
Open-source and free to use. 

