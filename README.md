AI Mock Interview Coach

I built this project to practice interview questions and get feedback on my answers. It allows users to select an interview role, record their answers using a camera, and get AI-generated feedback to understand where they can improve.

Features

Choose an interview role.

Practice common interview questions.

Record answers using the camera and microphone.

Type an answer for evaluation.

Get a score out of 10, feedback, and suggestions for improvement.

Move to the next question and continue practicing.

Technologies Used

HTML, CSS, JavaScript

Node.js and Express.js

Google Gemini API

Project Structure

AI-Mock-Interview-Coach/
├── index.html
├── style.css
├── script.js
├── README.md
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json
How to Run :

Install Node.js on your computer.

Open the terminal inside the backend folder.

Run npm install.

Create a .env file inside backend and add your Gemini API key:

GEMINI_API_KEY=your_api_key_here

Start the backend using node server.js.

Open index.html in your browser.

The backend runs at http://localhost:5000.
