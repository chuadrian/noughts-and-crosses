

const containerEl = document.querySelector(".container");
let playerText = document.querySelector(".message");
let messageTwo = document.querySelector(".message2")
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

        // Winning logic
        if (playerWins() !== false) {
            playerText.innerHTML = `<h2 class="message">Congrats Player ${currentPlayer}</h2>`;

            winnerIndicator = playerWins();

            winnerIndicator.map(
                (box) => (boxes[box].style.backgroundColor = "#2684af")
            );
            containerEl.classList.add('success');

            updateScore(currentPlayer);
        } else if (isDraw()) {
            playerText.innerHTML = `<h2 class="message">It's a Draw!</h2>`;
            messageTwo.innerHTML = `<p class="message2"></p>`
            setTimeout(restartGame, 2000); // Restart the game after 2 seconds
            containerEl.classList.add('success')
        } else {
            currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
        }
    }
}

// Winning combinations
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

// Check if player wins
function playerWins() {
    for (const condition of winningCombination) {
        let [a, b, c] = condition;

        if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
            return [a, b, c];
        }
    }
    return false;
}

// Check if the game is a draw
function isDraw() {
    return spaces.every(space => space !== null);
}

// Update the score
function updateScore(player) {
    if (player === X_TEXT) {
        scoreX++;
        scoreXEl.innerText = `Player X: ${scoreX}`;
    } else if (player === O_TEXT) {
        scoreO++;
        scoreOEl.innerText = `Player O: ${scoreO}`;
    }
}

// Reset the game
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
}

startGame();
