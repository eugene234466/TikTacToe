const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const resetBtn = document.querySelector('.reset-button');

let locked = false;

function setCells(board) {
  cells.forEach((cell, i) => {
    const val = board[i];
    cell.textContent = val;
    cell.className = 'cell';
    if (val === 'X') cell.classList.add('x', 'taken');
    if (val === 'O') cell.classList.add('o', 'taken');
  });
}

function highlightWinner(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      [a, b, c].forEach(i => cells[i].classList.add('winner'));
      return;
    }
  }
}

function setResult(winner) {
  resultEl.className = '';
  if (winner === 'X') {
    resultEl.textContent = 'YOU WIN!';
    resultEl.classList.add('win-x');
  } else if (winner === 'O') {
    resultEl.textContent = 'AI WINS!';
    resultEl.classList.add('win-o');
  } else if (winner === 'draw') {
    resultEl.textContent = "IT'S A DRAW";
    resultEl.classList.add('draw');
  }
}

cells.forEach(cell => {
  cell.addEventListener('click', async () => {
    if (locked) return;
    if (cell.classList.contains('taken')) return;

    const index = parseInt(cell.dataset.index);
    locked = true;
    statusEl.textContent = 'AI IS THINKING...';

    // Optimistic X render
    cell.textContent = 'X';
    cell.classList.add('x', 'taken', 'pop');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const res = await fetch('/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cell: index })
      });

      const data = await res.json();

      if (data.error) {
        // Revert optimistic render
        cell.textContent = '';
        cell.classList.remove('x', 'taken', 'pop');
        statusEl.textContent = 'YOUR TURN';
        locked = false;
        return;
      }

      setCells(data.board);

      // Pop animation on AI move
      if (data.ai_move !== null && data.ai_move !== undefined) {
        cells[data.ai_move].classList.add('pop');
      }

      if (data.game_over) {
        highlightWinner(data.board);
        setResult(data.winner);
        statusEl.textContent = 'GAME OVER';
        locked = true;
      } else {
        statusEl.textContent = 'YOUR TURN';
        resultEl.textContent = '';
        locked = false;
      }

    } catch (err) {
      console.error('Move failed:', err);
      cell.textContent = '';
      cell.classList.remove('x', 'taken', 'pop');
      statusEl.textContent = 'ERROR — TRY AGAIN';
      locked = false;
    }
  });
});

resetBtn.addEventListener('click', async () => {
  try {
    await fetch('/reset', { method: 'POST' });
    cells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'cell';
    });
    statusEl.textContent = 'YOUR TURN';
    resultEl.textContent = '';
    resultEl.className = '';
    locked = false;
  } catch (err) {
    console.error('Reset failed:', err);
  }
});

// Init status
statusEl.textContent = 'YOUR TURN';