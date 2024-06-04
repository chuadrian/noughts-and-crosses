const containerEl = document.querySelector(".container");
let playerText = document.querySelector(".message");
let restartBtn = document.getElementById('restart_btn');
let boxes = document.querySelectorAll(".box");

const O_TEXT = "O";
const X_TEXT = "X";

let currentPlayer = O_TEXT;
let spaces = Array(9).fill(null);
let winnerIndicator = getComputedStyle(document.body).getPropertyValue("--secondaryColor");

let scoreX = 0;
let scoreO = 0;

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

const startGame = () => {
    boxes.forEach((box) => box.addEventListener("click", boxClicked));
};

function boxClicked(e) {
    const id = e.target.id;

    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerWins() !== false) {
            playerText.innerHTML = `<h2 class="message">Congrats Player ${currentPlayer}</h2>`;
            highlightWinningBoxes(playerWins());
            updateScore(currentPlayer);
            showWinnerMessage(currentPlayer);
        } else if (isDraw()) {
            playerText.innerHTML = `<h2 class="message">It's a Draw!</h2>`;
            setTimeout(restartGame, 2000);
        } else {
            currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
            if (currentPlayer === X_TEXT) {
                setTimeout(computerMove, 500);
            }
        }
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i] === null) {
            spaces[i] = currentPlayer;
            let score = minimax(spaces, 0, false);
            spaces[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    spaces[move] = currentPlayer;
    boxes[move].innerText = currentPlayer;

    if (playerWins() !== false) {
        playerText.innerHTML = `<h2 class="message">Computer ${currentPlayer} won the game</h2>`;
        highlightWinningBoxes(playerWins());
        updateScore(currentPlayer);
        showWinnerMessage(currentPlayer);
    } else if (isDraw()) {
        playerText.innerHTML = `<h2 class="message">It's a Draw!</h2>`;
        setTimeout(restartGame, 2000);
    } else {
        currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
    }
}

function minimax(newSpaces, depth, isMaximizing) {
    let result = playerWins();
    if (result !== false) {
        return result === X_TEXT ? 1 : -1;
    }

    if (isDraw()) {
        return 0;
    }

    if (depth >= 2) { // Limiting depth for variability
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newSpaces.length; i++) {
            if (newSpaces[i] === null) {
                newSpaces[i] = X_TEXT;
                let score = minimax(newSpaces, depth + 1, false);
                newSpaces[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newSpaces.length; i++) {
            if (newSpaces[i] === null) {
                newSpaces[i] = O_TEXT;
                let score = minimax(newSpaces, depth + 1, true);
                newSpaces[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerWins() {
    for (const condition of winningCombination) {
        let [a, b, c] = condition;

        if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
            return condition;
        }
    }
    return false;
}

function isDraw() {
    return spaces.every(space => space !== null);
}

function updateScore(player) {
    if (player === X_TEXT) {
        scoreX++;
        scoreXEl.innerText = `Player X: ${scoreX}`;
    } else if (player === O_TEXT) {
        scoreO++;
        scoreOEl.innerText = `Player O: ${scoreO}`;
    }
}

function highlightWinningBoxes(winningCombination) {
    winningCombination.forEach(box => {
        boxes[box].style.backgroundColor = "#2684af";
    });
    containerEl.classList.add('success');
}

function showWinnerMessage(player) {
    setTimeout(() => {
        if (player === X_TEXT) {
            playerText.innerHTML = `<h2 class="message">Computer X won the game</h2>`;
        } else {
            playerText.innerHTML = `<h2 class="message">Congrats Player O</h2>`;
        }
        containerEl.classList.add('success');
    }, 100);
}

restartBtn.addEventListener('click', restartGame);

function restartGame() {
    spaces.fill(null);

    boxes.forEach((box) => {
        box.innerHTML = "";
        box.style.backgroundColor = "";
    });

    playerText.innerHTML = "TIC TAC TOE";
    currentPlayer = O_TEXT;
    containerEl.classList.remove("success");

    if (currentPlayer === X_TEXT) {
        setTimeout(computerMove, 500);
    }
}

startGame();
