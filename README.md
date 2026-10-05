# MovieFlick 🎬

## Project Overview
MovieFlick is an intelligent, full-stack movie discovery and recommendation platform designed to help users find their next favorite film. It enhances traditional movie browsing with AI-driven capabilities, offering personalized curation, detailed movie information, user profiles, and sentiment-analyzed reviews via a microservice architecture.

## Key Features
- **AI-Powered Recommendations:** Get tailored movie suggestions based on advanced algorithmic calculations.
- **Sentiment Analysis:** User reviews are analyzed for their context (positive, neutral, negative) using NLP.
- **Secure User Authentication:** Comprehensive registration, login, and password reset flows (with email recovery).
- **Responsive UI/UX:** A modern, mobile-friendly interface showcasing movie metadata, posters, and cast details.
- **Microservice Architecture:** Decoupled Python AI engine to ensure optimal performance when handling ML workloads.

## Tech Stack
* **Frontend:** React, React Router, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **AI Service:** Python, FastAPI, Scikit-learn, vaderSentiment, Numpy
* **Authentication:** JSON Web Tokens (JWT), bcrypt
* **Tooling:** Concurrently, Nodemailer

## Architecture
MovieFlick utilizes a robust three-tier architecture:
1. **Client Tier (React):** A responsive single-page application built with Vite handling user interactions and rendering dynamic content.
2. **API Gateway & Core Logic (Node.js/Express):** Manages user sessions, authentication, direct database queries, and proxies heavy ML requests to the AI service. 
3. **AI Microservice (Python/FastAPI):** A dedicated backend that securely handles machine learning workloads, including recommendation algorithms and natural language processing (sentiment analysis).

## Main Functionality
- **Movie Discovery:** Browse popular, top-rated, and categorized cinema. 
- **Movie Details:** Deep dive into specific movies to see the synopsis, rating, banner, and cast lists.
- **Account Management:** Sign up, log in, manage profile info, and securely reset passwords via Nodemailer integration.
- **Interactive Reviews:** Users can leave reviews that instantly get quantified for positive or negative sentiment.
- **Personalized Suggestions:** A dynamic recommendation section curated for the user's taste loop.

## How to Run It

### Prerequisites
- Node.js & npm installed
- Python 3.9+ installed
- MySQL Database properly configured

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd movie-recommendation
   ```

2. **Setup Dependencies:**
   - Install root dependencies: `npm install`
   - Install Client dependencies: `cd client && npm install`
   - Install Server dependencies: `cd server && npm install`
   
3. **Setup AI Service (Python):**
   ```bash
   cd ai-service
   python -m venv venv
   # Activate venv: `venv\Scripts\activate` on Windows, `source venv/bin/activate` on Mac/Linux
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create `.env` files in both the `server/` and `ai-service/` directories outlining your secrets (e.g., Database credentials, JWT Secret, Gmail App Passwords).

5. **Start Development Servers:**
   From the root project directory, start everything concurrently:
   ```bash
   npm run dev
   ```
   *This single command will spin up the React frontend, Express API server, and the FastAPI Python service stream.*

## Screenshots
*(Add high-quality screenshots of your application here)*
- `[Home Page / Dashboard]`
- `[Movie Details Page]`
- `[AI Recommendations UI]`
- `[Login/Register Screen]`

## Future Scope
- **Collaborative Filtering:** Implementing deeper user-to-user based hybrid recommendation models.
- **Watchlists & Social Sharing:** Allow users to share lists of their favorite movies with links.
- **Mobile Application:** Expand the platform to native iOS and Android environments using React Native.
- **Advanced Notification System:** Real-time push notifications for new trending movies matching a user's taste profile.

## Resume-ready Project Description
**MovieFlick | AI-Powered Movie Recommendation Engine**
*Full-Stack Application using React, Node.js, Express, MySQL, and Python (FastAPI)*
- Architected a microservice-based movie platform separating core business logic (Node.js) from heavy machine-learning and NLP workloads (FastAPI).
- Integrated `Scikit-learn` and `vaderSentiment` into a Python microservice to deliver custom content recommendations and real-time sentiment analysis on movie reviews.
- Designed a highly responsive UI with React and Vite, optimizing data rendering and load times.
- Built a secure authentication system featuring JWT, bcrypt password hashing, and dynamic email-based account recovery utilizing Nodemailer.
- Facilitated seamless bi-directional data flow scaling user experiences alongside an integrated MySQL database layer.
