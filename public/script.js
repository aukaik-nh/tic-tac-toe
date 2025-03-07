let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerScore = 0;
let botScore = 0;
let consecutiveWins = 0;
let gameStatus = document.getElementById("status");
let isPlayerTurn = true; // Start with Player's turn

function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");

    popupMessage.textContent = message;
    popup.classList.add("show");

    // แสดงป๊อปอัพแล้วอัปเดตคะแนนตามผลลัพธ์
    setTimeout(() => {
        closePopup();  // ปิดป๊อปอัพหลังจาก 2 วินาที
    }, 2000);
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("show"); // ลบ class "show" เมื่อปิดป๊อปอัพ
    console.log("Popup closed");  // ตรวจสอบว่า popup ถูกปิด
}

function makeMove(index) {
    if (board[index] !== "" || gameStatus.textContent.includes("wins")) return;

    board[index] = currentPlayer;
    let cell = document.getElementsByClassName("cell")[index];

    // สร้าง <img> แทนที่จะใช้ข้อความ
    let img = document.createElement("img");

    if (currentPlayer === "X") {
        img.src = "assets/x-image.png";
        img.alt = "X";
    } else {
        img.src = "assets/o-image.png";
        img.alt = "O";
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
            endGame(playerScore, botScore, consecutiveWins);  // บันทึกประวัติเมื่อจบเกม
        }, 2000);
        return;
    }

    if (board.every(cell => cell !== "")) {
        setTimeout(() => {
            showPopup("It's a draw!");
            resetGame();
            endGame(playerScore, botScore, consecutiveWins);  // บันทึกประวัติเมื่อจบเกม
        }, 2000);
        return;
    }

    // สลับตา และอัปเดตสถานะ
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameStatus.textContent = currentPlayer === "X" ? "Player Turn" : "Bot Turn";
    changeTurn();
    if (currentPlayer === "O") {
        setTimeout(botMove, 1000);
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

function updateScore(winner) {
    if (winner === "X") {
        playerScore++;   
        consecutiveWins++;   // เพิ่มการนับจำนวนครั้งที่ชนะติดต่อกัน
        
        // เพิ่มคะแนนพิเศษหากชนะติดต่อกัน 3 ครั้ง
        if (consecutiveWins === 3) {
            playerScore++; // เพิ่มคะแนนพิเศษ 1 คะแนน
            consecutiveWins = 0; // รีเซ็ตการนับชนะติดต่อกัน
        }
    } else if (winner === "O") {
        botScore++; 
        consecutiveWins = 0;  // รีเซ็ตเมื่อบอทชนะ
    }

    // แสดงคะแนนที่อัปเดตใน UI
    document.getElementById("player-score").textContent = playerScore;
    document.getElementById("bot-score").textContent = botScore;

    // อัปเดตในหน้าตารางสกอร์ (full scoreboard)
    document.getElementById("player-score-full").textContent = playerScore;
    document.getElementById("bot-score-full").textContent = botScore;
    document.getElementById("consecutive-wins").textContent = consecutiveWins;
}

function botMove() {
    let availableMoves = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    
    // กำหนดเปอร์เซ็นต์ที่จะให้บอทสุ่มเลือกการเคลื่อนไหว
    if (Math.random() < 0.2) {  // 20% ของกรณีให้เลือกแบบสุ่ม
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
    let maxDepth = 3;  // ลดความลึกเป็น 3 เพื่อให้คิดเร็วขึ้น
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

    // Check for terminal states
    if (checkWin("O")) return 1;
    if (checkWin("X")) return -1;
    if (availableMoves.length === 0) return 0;

    let best = isMaximizing ? -Infinity : Infinity;

    for (let move of availableMoves) {
        board[move] = isMaximizing ? "O" : "X";
        let score = minimax(board, depth + 1, !isMaximizing);
        board[move] = "";  // revert move

        if (isMaximizing) {
            best = Math.max(best, score);
        } else {
            best = Math.min(best, score);
        }
    }

    // Introduce a small chance of not playing the best move
    if (Math.random() < 0.1) { // 10% chance
        return best + Math.random() * 0.5 - 0.25; // Slightly random score
    }

    return best;
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function botMove() {
    let move = bestMove();
    makeMove(move);
}


function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";  // เริ่มต้นที่ Player
    gameStatus.textContent = "Player Start"; // เปลี่ยนสถานะเป็น Player Start เมื่อเริ่มเกมใหม่

    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner"); // รีเซ็ตการทำเครื่องหมายว่าเป็นผู้ชนะ
    });

    // รีเซ็ตสีเส้นเป็นสีดำและสถานะ Player Turn
    document.querySelectorAll(".score-item").forEach(item => {
        item.classList.remove("draw", "player-turn", "bot-turn"); // ลบทุกคลาสที่ไม่จำเป็น
        item.style.borderColor = "black";  // รีเซ็ตเส้นขอบให้เป็นสีดำ
    });

    changeTurn();  // รีเซ็ตเส้นขอบ Player และ Bot ให้ถูกต้อง
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
    
    if (turn === "X") {
      statusEl.textContent = "X TURN";
    } else if (turn === "O") {
      statusEl.textContent = "O TURN";
    }
  }

  function saveGameHistory(playerScore, botScore, consecutiveWins) {
    console.log("Saving game history...");
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    let result = "Draw";  // กำหนดค่าเริ่มต้นเป็นเสมอ

    // ตรวจสอบผลการแข่งขัน
    if (playerScore > botScore) {
        result = "Player Wins";
    } else if (botScore > playerScore) {
        result = "Bot Wins";
    }

    const newGame = {
        playerScore: playerScore,
        botScore: botScore,
        consecutiveWins: consecutiveWins,
        result: result // เก็บผลการแข่งขัน
    };

    gameHistory.push(newGame);
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));

    console.log("Game history saved:", gameHistory);
}


function resetGameData() {
    // เคลียร์ข้อมูลทั้งหมดใน localStorage
    localStorage.clear();
    
    // หรือถ้าต้องการลบเฉพาะประวัติการเล่น
    // localStorage.removeItem('gameHistory');

    // เพิ่มโค้ดที่ใช้ในการรีเซ็ตเกมที่จำเป็น
    console.log("Game data cleared.");
}


function endGame(playerScore, botScore, consecutiveWins) {
    console.log("Ending game...");

    // ตรวจสอบผลการแข่งขัน
    let resultMessage = "Game Over!";

    // ถ้าผู้เล่นชนะ
    if (playerScore > botScore) {
        resultMessage = "Player Wins!";
    } else if (botScore > playerScore) { // ถ้าบอทชนะ
        resultMessage = "Bot Wins!";
    } else { // ถ้าเสมอ
        resultMessage = "It's a Draw!";
    }

    saveGameHistory(playerScore, botScore, consecutiveWins);  // บันทึกประวัติ
    showPopup(resultMessage);  // แสดงข้อความที่เหมาะสมเมื่อจบเกม
    // resetGameData()
}


function changeTurn() {
    const playerScoreElement = document.querySelector('.score-item.player');
    const botScoreElement = document.querySelector('.score-item.bot');

    if (isPlayerTurn) {
        // Player's turn
        playerScoreElement.classList.add('player-turn');
        botScoreElement.classList.remove('bot-turn');
    } else {
        // Bot's turn
        botScoreElement.classList.add('bot-turn');
        playerScoreElement.classList.remove('player-turn');
    }

    // เช็คว่ากระดานเต็มหรือยัง (เสมอ)
    if (board.every(cell => cell !== "")) {
        // เกมเสมอ
        document.querySelectorAll(".score-item").forEach(item => {
            item.classList.add("draw");  // เปลี่ยนเส้นเป็นสีเขียวเมื่อเสมอ
        });
    } else {
        // ถ้าไม่เสมอ ให้ลบ class "draw" ออก
        document.querySelectorAll(".score-item").forEach(item => {
            item.classList.remove("draw");
        });
    }

    // สลับตาของผู้เล่น
    isPlayerTurn = !isPlayerTurn;  // Toggle the turn
}
