let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerScore = 0;
let botScore = 0;
let consecutiveWins = 0;
let gameStatus = document.getElementById("status");

function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");

    popupMessage.textContent = message; // เปลี่ยนข้อความใน popup
    popup.classList.add("show"); // เพิ่ม class "show" เพื่อให้ป๊อปอัพแสดงขึ้นมา
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("show"); // ลบ class "show" เมื่อปิดป๊อปอัพ
}

function makeMove(index) {
    if (board[index] !== "" || gameStatus.textContent.includes("wins")) return;

    board[index] = currentPlayer;
    let cell = document.getElementsByClassName("cell")[index];

    // สร้าง <img> แทนที่จะใช้ข้อความ
    let img = document.createElement("img");

    if (currentPlayer === "X") {
        img.src = "assets/x-image.png";  // ใช้เส้นทางสัมพัทธ์
        img.alt = "X";
    } else {
        img.src = "assets/o-image.webp"; // ใช้เส้นทางสัมพัทธ์
        img.alt = "O";
    }

    cell.innerHTML = "";  // ล้างเนื้อหาในเซลล์
    cell.appendChild(img);  // เพิ่มรูปภาพแทนที่ข้อความ

    const winningPattern = checkWin(currentPlayer);

    if (winningPattern) {
        updateScore(currentPlayer);
        drawWinLine(winningPattern);

        setTimeout(() => {
            showPopup(`${currentPlayer} wins!`);
            resetGame();
        }, 1000);
        return;
    }

    if (board.every(cell => cell !== "")) {
        setTimeout(() => {
            showPopup("It's a draw!");
            resetGame();
        }, 1000);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}


function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === player)) {
            return pattern;
        }
    }

    return null;
}

function makeMove(index) {
    if (board[index] !== "" || gameStatus.textContent.includes("wins")) return;

    board[index] = currentPlayer;
    let cell = document.getElementsByClassName("cell")[index];

    // สร้าง <img> แทนที่จะใช้ข้อความ
    let img = document.createElement("img");
    if (currentPlayer === "X") {
        img.src = "assets/x-image.png";  // เส้นทางของรูปภาพ X
        img.alt = "X";
    } else {
        img.src = "assets/o-image.webp";  // เส้นทางของรูปภาพ O
        img.alt = "O";
    }
    
    cell.innerHTML = "";  // ล้างเนื้อหาในเซลล์
    cell.appendChild(img);  // เพิ่มรูปภาพแทนที่ข้อความ

    const winningPattern = checkWin(currentPlayer);

    if (winningPattern) {
        updateScore(currentPlayer);
        drawWinLine(winningPattern);

        setTimeout(() => {
            showPopup(`${currentPlayer} wins!`);
            resetGame();
        }, 2000);
        return;
    }

    if (board.every(cell => cell !== "")) {
        setTimeout(() => {
            showPopup("It's a draw!");
            resetGame();
        }, 2000);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}

function hideScoreTable() {
    document.getElementById("score-table").style.display = "none";
}

function updateScore(winner) {
    if (winner === "X") {
        playerScore++;   
        consecutiveWins++;   
        if (consecutiveWins === 3) {
            playerScore++; 
            consecutiveWins = 0; 
        }
    } else if (winner === "O") {
        botScore++; 
        consecutiveWins = 0; 
    }

    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("bot-score").textContent = botScore;
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
    let maxDepth = 5;  
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

function minimax(board, depth, isMaximizing, maxDepth) {
    if (depth === maxDepth) return 0;
    if (checkWin("O")) return 1;
    if (checkWin("X")) return -1;
    if (board.every(cell => cell !== "")) return 0;

    let best = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = isMaximizing ? "O" : "X";
            let score = minimax(board, depth + 1, !isMaximizing, maxDepth);
            board[i] = "";  

            best = isMaximizing ? Math.max(best, score) : Math.min(best, score);
        }
    }

    return best;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStatus.textContent = "";

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
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

