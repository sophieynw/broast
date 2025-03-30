# 🐻 BRoast  
*A BearHacks 2025 Hackathon Project*

**Broast** is a Gen Z-style AI resume roaster that gives brutally honest yet helpful feedback on uploaded resumes. It uses sarcasm and sass to point out weak spots while cheering you on with encouraging advice. Built with Angular (frontend) and Flask (backend) over one chaotic weekend at BearHacks 2025.

## 🚀 Demo
Coming soon — stay tuned!  
(Or clone and run it locally below 👇)

## 🛠️ Run Locally

### 1. Clone the Repo

#### Starting the frontend server

```bash
cd frontend
npm install
ng serve -o
```
This will automatically open the app in your browser at http://localhost:4200

#### Starting the backend server

```bash
cd backend
python -m venv venv               # Create virtual environment
source venv/bin/activate          # (Windows: venv\Scripts\activate)
pip install -r requirements.txt   # Install dependencies
flask run                         # Start the Flask server
```
Backend runs on http://127.0.0.1:5000

## Environment Variables

Create a `.env` file in the `backend/` folder with the following:
```
GPT_API_KEY=[your openai api key]
PERPLEXITY_API_KEY=[your perplexity api key]
```

## Future Plans
- Roast GitHub & LinkedIn profile through link uploads
- Let users toggle between roast intensity (mild → 🌶️)
- Add shareable roast cards for LinkedIn
- Login to access Broast history

## Roast responsibly 💼🔥
