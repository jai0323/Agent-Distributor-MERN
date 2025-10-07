# Agent Distributor - MERN Stack Application

## Features
1. Admin User Login
2. Agent Creation & Management
3. Uploading and Distributing Lists

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js
- Tailwind CSS (Frontend Styling)

---

## Setup Instructions

### Backend
1. Go to the backend folder:
    bash
        cd backend

2. Install dependencies:
    bash
        npm install

3. Create .env file using .env.example:

    MONGO_URI=yourMongoDBURI
    JWT_SECRET=yourSecretKey
    PORT=5000

4. Seed Admin and Agents:

    node seedAdmin.js
    node seedAgents.js


5. Start the backend server:

    npm run dev


Frontend

1. Go to the frontend folder:

    cd frontend


2. Install dependencies:

    npm install


3. Start the React app:

    npm start


Usage

1. Open the frontend in your browser (usually http://localhost:3000).

2. Login as Admin.

3. Add agents via the Agents page.

4. Upload CSV/XLSX files to distribute leads among agents.

5. View leads assigned to each agent.


Notes

1. Ensure MongoDB is running locally or use a cloud instance (e.g., MongoDB Atlas).

2. Admin credentials are seeded via seedAdmin.js.

3. Make sure the CSV/XLSX files follow the required format: FirstName, Phone, Notes.

Video Demonstration

Watch the working video demo here:
View Demo :- https://drive.google.com/drive/folders/16cfrR1cmVsZt7QnSLWdXHzDhUboCoP_x?usp=drive_link


License

This project is for assignment/submission purposes only.
