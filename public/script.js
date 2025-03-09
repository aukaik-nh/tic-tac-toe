let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "Player";
let playerScore = 0;
let botScore = 0;
let consecutiveWins = 0;
let gameStatus = document.getElementById("status");
let isPlayerTurn = true; 

function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message;
    popup.classList.add("show");

    setTimeout(closePopup, 2000);
}

function closePopup(event) {
    if (event) event.stopPropagation();
    
    const popup = document.getElementById("popup");

    popup.classList.remove("show");
}

function makeMove(index) {
    if (board[index] !== "" || gameStatus.textContent.includes("wins") || gameStatus.textContent.includes("draw")) {
        return; 
    }

    board[index] = currentPlayer;
    let cell = document.getElementsByClassName("cell")[index];

    let img = document.createElement("img");

    if (currentPlayer === "Player") {
        img.src = "assets/x-image.png";
        img.alt = "Player";
    } else {
        img.src = "assets/o-image.png";
        img.alt = "Bot";
    }

    cell.innerHTML = "";
    cell.appendChild(img);

    const winningPattern = checkWin(currentPlayer);

    if (winningPattern) {
        updateScore(currentPlayer);
        drawWinLine(winningPattern);
        setTimeout(() => {
            showPopup(`${currentPlayer} wins!`);
            resetGame();  
            endGame(playerScore, botScore, consecutiveWins);  
        }, 500);  
        return;
    }

    if (board.every(cell => cell !== "")) {
        setTimeout(() => {
            showPopup("It's a draw!");
            resetGame();
            endGame(playerScore, botScore, consecutiveWins); 
        }, 1000);  
        return;
    }

    currentPlayer = currentPlayer === "Player" ? "Bot" : "Player";
    gameStatus.textContent = currentPlayer === "Player" ? "Player Turn" : "Bot Turn";
    changeTurn();

    if (currentPlayer === "Bot") {
        setTimeout(botMove, 1000);
    }
}


function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // แนวนอน
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // แนวตั้ง
        [0, 4, 8], [2, 4, 6]             // แนวทแยง
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return pattern;  
        }
    }
    return null;
}

function updateScore(winner) {
    if (winner === "Player") { 
        playerScore++;   
        consecutiveWins++;  

        if (consecutiveWins === 3) {
            playerScore++;  
            consecutiveWins = 0;   
        }
    } else if (winner === "Bot") { 
        botScore++;  
        consecutiveWins = 0;   
    }
    const playerScoreElement = document.getElementById("player-score");
    const botScoreElement = document.getElementById("bot-score");
    const playerScoreFullElement = document.getElementById("player-score-full");
    const botScoreFullElement = document.getElementById("bot-score-full");
    const consecutiveWinsElement = document.getElementById("consecutive-wins");

    if (playerScoreElement) playerScoreElement.textContent = playerScore;
    if (botScoreElement) botScoreElement.textContent = botScore;
    if (playerScoreFullElement) playerScoreFullElement.textContent = playerScore;
    if (botScoreFullElement) botScoreFullElement.textContent = botScore;
    if (consecutiveWinsElement) consecutiveWinsElement.textContent = consecutiveWins;
}


function botMove() {
    let availableMoves = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    
    if (Math.random() < 0.2) { 
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(move);
    } else {
        let move = bestMove();  
        makeMove(move);
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    let maxDepth = 3;  
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false, maxDepth);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = { "X": -1, "O": 1, "draw": 0 };
    const availableMoves = board.map((val, index) => val === "" ? index : null).filter(index => index !== null);

    if (checkWin("Bot")) return 1;
    if (checkWin("Player")) return -1;
    if (availableMoves.length === 0) return 0;

    let best = isMaximizing ? -Infinity : Infinity;

    for (let move of availableMoves) {
        board[move] = isMaximizing ? "Bot" : "Player";
        let score = minimax(board, depth + 1, !isMaximizing);
        board[move] = "";

        if (isMaximizing) {
            best = Math.max(best, score);
        } else {
            best = Math.min(best, score);
        }
    }
// ปรับบอท
    // if (Math.random() < 0.1) {
    //     return best + Math.random() * 0.5 - 0.25; 
    // }

    if (Math.random() < 0.5) {
        return best + Math.random() * 0.5 - 0.25; 
    }
    
    return best;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "Player"; 
    gameStatus.textContent = "Player Start"; 

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner"); 
    });

    document.querySelectorAll(".score-item").forEach(item => {
        item.classList.remove("draw", "player-turn", "bot-turn"); 
        item.style.borderColor = "black";  
    });

    changeTurn();  
    
    if (gameStatus.textContent === "Player Start" || gameStatus.textContent.includes("draw")) {
        document.querySelector('.score-item.player').style.borderColor = "black";
        document.querySelector('.score-item.bot').style.borderColor = "black";
    }
}


function drawWinLine(pattern) {
    pattern.forEach(index => {
        document.getElementsByClassName("cell")[index].classList.add("winner");
    });
}

function viewFullScore() {
    document.getElementById("player-score-full").textContent = playerScore;
    document.getElementById("bot-score-full").textContent = botScore;
    document.getElementById("consecutive-wins").textContent = consecutiveWins;
    document.getElementById("score-table").style.display = "block";
}

function hideScoreTable() {
    document.getElementById("score-table").style.display = "none";
}

function updateTurnDisplay(turn) {
    const statusEl = document.getElementById("status");
    
    if (turn === "Player") {
      statusEl.textContent = "Player TURN";
    } else if (turn === "Bot") {
      statusEl.textContent = "Bot TURN";
    }
  }

  function saveGameHistory(playerScore, botScore, consecutiveWins) {
    console.log("Saving game history...");
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    let result = "Draw"; 
    if (playerScore > botScore) {
        result = "Player Wins";
    } else if (botScore > playerScore) {
        result = "Bot Wins";
    }

    const newGame = {
        playerScore: playerScore,
        botScore: botScore,
        consecutiveWins: consecutiveWins,
        result: result 
    };

    gameHistory.push(newGame);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

    console.log("Game history saved:", gameHistory);
}


function resetGameData() {
    localStorage.clear();

    // localStorage.removeItem('gameHistory');
    console.log("Game data cleared.");
}

function endGame(playerScore, botScore, consecutiveWins) {
    console.log("Ending game...");

    let resultMessage = "Game Over!";

    if (playerScore > botScore) {
        resultMessage = "Player Wins!";
    } else if (botScore > playerScore) {
        resultMessage = "Bot Wins!";
    } else {
        resultMessage = "It's a Draw!";
    }

    saveGameHistory(playerScore, botScore, consecutiveWins, resultMessage);
    // resetGameData()
}

function saveGameHistory(playerScore, botScore, consecutiveWins, result) {
    console.log("Saving game history...");

    // ดึงข้อมูลจาก LocalStorage (หากมี)
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    // เพิ่มข้อมูลเกมใหม่
    const newGame = {
        playerScore: playerScore,
        botScore: botScore,
        consecutiveWins: consecutiveWins,
        result: result // ผลลัพธ์ของเกม
    };

    gameHistory.push(newGame);

    // บันทึกข้อมูลลงใน LocalStorage
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

    console.log("Game history saved:", gameHistory);
}

function changeTurn() {
    const playerScoreElement = document.querySelector('.score-item.player');
    const botScoreElement = document.querySelector('.score-item.bot');

    if (currentPlayer === "Player") {
        playerScoreElement.style.borderColor = "pink";
        botScoreElement.style.borderColor = "black";
    } else {
        botScoreElement.style.borderColor = "pink";
        playerScoreElement.style.borderColor = "black";
    }

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        if (currentPlayer === "Player") {
            if (cell.innerHTML === "") {
                cell.style.pointerEvents = "auto";  
            } else {
                cell.style.pointerEvents = "none"; 
            }
        } else {
            cell.style.pointerEvents = "none";
        }
    });

    isPlayerTurn = !isPlayerTurn; 
}
