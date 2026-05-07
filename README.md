# Tic Tac Toe — Player vs AI

A dark neon-themed Tic Tac Toe web app built with Flask. Play against an unbeatable Minimax AI in a retro arcade interface.

## Features

- **Unbeatable AI** powered by the Minimax algorithm
- **Neon arcade UI** with scanline effect, glow animations, and smooth transitions
- **Session-based game state** — board lives server-side
- **Responsive** — works on desktop and mobile

## Tech Stack

- **Backend:** Python, Flask, Flask-Session
- **Frontend:** Vanilla JS, CSS3
- **AI:** Minimax algorithm (no external libraries)
- **Fonts:** JetBrains Mono (Google Fonts)

## Project Structure

```
TTC/
├── app.py              # Flask app + Minimax AI logic
├── requirements.txt
├── .env
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── game.js
```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/tic-tac-toe.git
cd tic-tac-toe
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

Create a `.env` file in the root:

```
FLASK_SECRET_KEY=your-secret-key-here
```

### 4. Run the app

```bash
flask run
```

Visit `http://127.0.0.1:5000` in your browser.

## How It Works

- The player is **X**, the AI is **O**
- Player clicks a cell → browser sends `POST /move` with the cell index
- Flask places the X, runs Minimax to find the optimal AI move, places the O
- Updated board + game status returned as JSON
- Frontend updates the UI accordingly

## Deployment

Deployed on Render. Set the `FLASK_SECRET_KEY` environment variable in your Render dashboard.

```yaml
buildCommand: pip install -r requirements.txt
startCommand: gunicorn app:app
```

## License

MIT

---

Built by Eugene Yarney © 2026
