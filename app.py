import os
from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')


def check_winner(board):
    wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]

    for combo in wins:
        a, b, c = combo
        if board[a] == board[b] == board[c] and board[a] != "":
            return board[a]

    if "" not in board:
        return "draw"

    return None


def minimax(board, is_maximizing):
    result = check_winner(board)

    if result == 'O':
        return 1
    elif result == 'X':
        return -1
    elif result == 'draw':
        return 0

    if is_maximizing:
        best_score = float('-inf')
        for i in range(9):
            if board[i] == "":
                board[i] = 'O'
                score = minimax(board, False)
                board[i] = ""
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if board[i] == "":
                board[i] = 'X'
                score = minimax(board, True)
                board[i] = ""
                best_score = min(score, best_score)
        return best_score


def get_best_move(board):
    best_score = float('-inf')
    move = None

    for i in range(9):
        if board[i] == "":
            board[i] = 'O'
            score = minimax(board, False)
            board[i] = ""
            if score > best_score:
                best_score = score
                move = i

    return move


@app.route('/', methods=['GET'])
def main():
    session['board'] = [''] * 9
    session['game_over'] = False
    session['winner'] = None
    return render_template('index.html')


@app.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    cell_index = int(data['cell'])

    board = session.get('board', [''] * 9)
    game_over = session.get('game_over', False)

    if game_over:
        return jsonify({'error': 'Game already over'}), 400

    if board[cell_index] != "":
        return jsonify({'error': 'Cell already taken'}), 400

    # Player move
    board[cell_index] = 'X'
    winner = check_winner(board)

    if winner:
        session['board'] = board
        session['game_over'] = True
        session['winner'] = winner
        return jsonify({'board': board, 'winner': winner, 'game_over': True})

    # AI move
    ai_move = get_best_move(board)
    if ai_move is not None:
        board[ai_move] = 'O'
        winner = check_winner(board)

    session['board'] = board
    session['game_over'] = bool(winner)
    session['winner'] = winner

    return jsonify({
        'board': board,
        'winner': winner,
        'game_over': bool(winner),
        'ai_move': ai_move
    })


@app.route('/reset', methods=['POST'])
def reset():
    session.clear()
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True)