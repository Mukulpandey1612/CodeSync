CodeSync - Real-Time Collaborative Code Editor
CodeSync is a web-based collaborative code editor that allows multiple users to write, edit, and execute code together in real-time. It's designed for pair programming, technical interviews, and remote learning, featuring live code synchronization, multi-language code execution, and an integrated AI assistant powered by the Google Gemini API.

✨ Key Features
Real-Time Collaboration: Code, language selections, and user presence are synchronized instantly across all participants in a room using Socket.IO.

Multi-Language Code Execution: Execute code snippets in various languages (JavaScript, Python, C++, Java, etc.) using the Judge0 API and view the output directly in the editor.

AI-Powered Assistance: Get feedback, find bugs about your code with an integrated AI assistant powered by Google's Gemini API.

Live User Presence: See who is currently active in the room and view live typing indicators.

Room-Based Sessions: Create unique rooms with shareable IDs for private coding sessions.

Modern Editor Experience: Built with the Monaco Editor for a smooth, responsive, and feature-rich coding environment.

🛠️ Tech Stack
Frontend (Client)
Framework: React

Real-Time Communication: Socket.IO Client

HTTP Client: Axios

Code Editor: Monaco Editor

Deployment: Vercel

Backend (Server)
Framework: Node.js & Express

Real-Time Communication: Socket.IO

AI Integration: Google Gemini API

Code Execution: Judge0 RapidAPI

Deployment: Render

🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v18.x or higher)

npm (comes with Node.js)

API keys for Google Gemini and Judge0 (RapidAPI).

1. Clone the Repository
git clone [https://github.com/Mukulpandey1612/CodeSync.git](https://github.com/Mukulpandey1612/CodeSync.git)
cd CodeSync


2. Set Up the Backend
Navigate to the server directory:

cd server


Install dependencies:

npm install


Create a .env file in the server directory and add your API keys:

# .env in /server
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key
JUDGE0_API_KEY=your_judge0_rapidapi_key


Start the backend server:

npm start


The server should now be running on http://localhost:5000.

3. Set Up the Frontend
Open a new terminal and navigate to the client directory:

cd client


Install dependencies:

npm install


Create a .env file in the client directory:

# .env in /client
REACT_APP_API_URL=http://localhost:5000


Start the frontend development server:

npm start


The application should now be open and running in your browser at http://localhost:3000.


Made by Mukul Pandey.

GitHub

LinkedIn
