const BOARD_SIZE = 8;
const POINTS_PER_BLOCK = 10;

const gameBoard = document.getElementById("gameBoard");
const pieceContainer = document.getElementById("pieceContainer");
const scoreDisplay = document.getElementById("score");
const comboDisplay = document.getElementById("combo");
const gameMessage = document.getElementById("gameMessage");
const restartButton = document.getElementById("restartButton");

let board = [];
let score = 0;
let combo = 0;
let placementsWithoutClear = 0;

let pieces = [];
let selectedPiece = null;
let gameOverState = false;

let draggedPiece = null;
let draggedElement = null;


// =========================
// BLOCK SHAPES
// =========================

const SHAPES = [

    // 2x2 square
    [
        [1, 1],
        [1, 1]
    ],

    // 3x3 square
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ],

    // Horizontal 3
    [
        [1, 1, 1]
    ],

    // Horizontal 4
    [
        [1, 1, 1, 1]
    ],

    // Horizontal 5
    [
        [1, 1, 1, 1, 1]
    ],

    // Vertical 3
    [
        [1],
        [1],
        [1]
    ],

    // Vertical 4
    [
        [1],
        [1],
        [1],
        [1]
    ],

    // Vertical 5
    [
        [1],
        [1],
        [1],
        [1],
        [1]
    ],

    // L
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],

    // Reverse L
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],

    // L horizontal
    [
        [1, 1, 1],
        [1, 0, 0]
    ],

    // Reverse L horizontal
    [
        [1, 1, 1],
        [0, 0, 1]
    ],

    // T
    [
        [1, 1, 1],
        [0, 1, 0]
    ],

    // T vertical
    [
        [0, 1],
        [1, 1],
        [0, 1]
    ]

];


// =========================
// START GAME
// =========================

function startGame() {

    board = [];

    score = 0;

    combo = 0;

    placementsWithoutClear = 0;

    selectedPiece = null;

    draggedPiece = null;

    draggedElement = null;

    gameOverState = false;

    for (let row = 0; row < BOARD_SIZE; row++) {

        board[row] = [];

        for (let col = 0; col < BOARD_SIZE; col++) {

            board[row][col] = 0;

        }

    }

    updateScore();

    createBoard();

    generatePieces();

    gameMessage.textContent =
        "Drag a block onto the board 💕";

}


// =========================
// CREATE BOARD
// =========================

function createBoard() {

    gameBoard.innerHTML = "";

    for (let row = 0; row < BOARD_SIZE; row++) {

        for (let col = 0; col < BOARD_SIZE; col++) {

            const cell = document.createElement("div");

            cell.classList.add("board-cell");

            cell.dataset.row = row;

            cell.dataset.col = col;

            gameBoard.appendChild(cell);

        }

    }

}


// =========================
// GENERATE PIECES
// =========================

function generatePieces() {

    pieces = [];

    pieceContainer.innerHTML = "";

   for (
    let i = 0;
    i < 3;
    i++
) {

        const randomShape =
            SHAPES[
                Math.floor(
                    Math.random() * SHAPES.length
                )
            ];

        const piece = {

            shape: randomShape,

            id: Date.now() + i

        };

        pieces.push(piece);

        displayPiece(piece);

    }

}


// =========================
// DISPLAY PIECE
// =========================

function displayPiece(piece){

    const pieceElement = document.createElement("div");

    pieceElement.classList.add("piece");
    // create blocks here

    // CLICK + DRAG HERE
    pieceElement.addEventListener(
        "pointerdown",
        function(event){
            selectedPiece = piece;
            startDragging(event);
        }
    );
    pieceContainer.appendChild(pieceElement);
});
    });

    // Mouse + touch dragging
    pieceElement.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        selectedPiece = piece;


        document
        .querySelectorAll(".piece")
        .forEach(
            element => {
                element.classList.remove(
                    "selected"
                );
            }
        );


        pieceElement.classList.add(
            "selected"
        );


        startDragging(event);

    }
);

// =========================
// START DRAGGING
// =========================

function startDragging(event) {

    if (gameOverState) return;

    event.preventDefault();

    const pieceElement =
        event.currentTarget;

    const pieceId =
        Number(pieceElement.dataset.id);

    const piece =
        pieces.find(
            p => p.id === pieceId
        );

    if (!piece) return;

    draggedPiece = piece;

    selectedPiece = piece;

    draggedElement =
        createDraggedPiece(piece);

    document.body.appendChild(
        draggedElement
    );

    moveDraggedPiece(event);

    pieceElement.classList.add(
        "dragging"
    );

    document.addEventListener(
        "pointermove",
        moveDraggedPiece
    );

    document.addEventListener(
        "pointerup",
        stopDragging,
        { once: true }
    );

}


// =========================
// CREATE DRAGGED PIECE
// =========================

function createDraggedPiece(piece) {

    const dragElement =
        document.createElement("div");

    dragElement.classList.add(
        "dragged-piece"
    );

    dragElement.style.gridTemplateColumns =
        `repeat(${piece.shape[0].length}, 28px)`;

    piece.shape.forEach(row => {

        row.forEach(cell => {

            const block =
                document.createElement("div");

            if (cell === 1) {

                block.classList.add(
                    "dragged-piece-cell"
                );

            }

            dragElement.appendChild(
                block
            );

        });

    });

    return dragElement;

}


// =========================
// MOVE DRAGGED PIECE
// =========================

function moveDraggedPiece(event) {

    if (!draggedElement) return;

    draggedElement.style.left =
        `${event.clientX}px`;

    draggedElement.style.top =
        `${event.clientY}px`;

}


// =========================
// STOP DRAGGING
// =========================

function stopDragging(event) {

    if (!draggedPiece) return;

    const boardRect =
        gameBoard.getBoundingClientRect();

    const cellSize =
        boardRect.width / BOARD_SIZE;

    const col =
        Math.floor(
            (event.clientX - boardRect.left)
            / cellSize
        );

    const row =
        Math.floor(
            (event.clientY - boardRect.top)
            / cellSize
        );

    if (
        row >= 0 &&
        row < BOARD_SIZE &&
        col >= 0 &&
        col < BOARD_SIZE
    ) {

        placePiece(
            row,
            col,
            draggedPiece
        );

    }

    if (draggedElement) {

        draggedElement.remove();

    }

    document
        .querySelectorAll(".piece")
        .forEach(piece => {

            piece.classList.remove(
                "dragging"
            );

        });

    draggedPiece = null;

    draggedElement = null;

    document.removeEventListener(
        "pointermove",
        moveDraggedPiece
    );

}


// =========================
// PLACE PIECE
// =========================

function placePiece(
    startRow,
    startCol,
    piece
) {

    if (!piece) return;

    const shape =
        piece.shape;

    if (
        !canPlace(
            shape,
            startRow,
            startCol
        )
    ) {

        gameMessage.textContent =
            "That block cannot fit there 💔";

        return;

    }

    let blockCount = 0;

    for (
        let row = 0;
        row < shape.length;
        row++
    ) {

        for (
            let col = 0;
            col < shape[row].length;
            col++
        ) {

            if (
                shape[row][col] === 1
            ) {

                board[
                    startRow + row
                ][
                    startCol + col
                ] = 1;

                blockCount++;

            }

        }

    }


    // Points for placing blocks

    score +=
        blockCount *
        POINTS_PER_BLOCK;


    // Remove used piece

    pieces =
        pieces.filter(
            p =>
                p.id !== piece.id
        );


    const clearedLines =
        clearLines();


    if (
        clearedLines > 0
    ) {

        combo++;

        placementsWithoutClear = 0;

        const clearPoints =
            clearedLines *
            BOARD_SIZE *
            combo;

        score += clearPoints;

        gameMessage.textContent =
            `${clearedLines} line(s) cleared 🔥 Combo ${combo}`;

    } else {

        placementsWithoutClear++;

        if (
            placementsWithoutClear >= 3
        ) {

            combo = 0;

            placementsWithoutClear = 0;

            gameMessage.textContent =
                "Combo lost 💔";

        }

    }


    updateScore();

    renderBoard();


    if (
        pieces.length === 0
    ) {

        generatePieces();

    }


    if (
        !hasPossibleMove()
    ) {

        gameOverState = true;

        gameMessage.textContent =
            `Game Over 💔 Final Score: ${score}`;

    }

}


// =========================
// CAN PLACE
// =========================

function canPlace(
    shape,
    startRow,
    startCol
) {

    for (
        let row = 0;
        row < shape.length;
        row++
    ) {

        for (
            let col = 0;
            col < shape[row].length;
            col++
        ) {

            if (
                shape[row][col] === 0
            ) {

                continue;

            }

            const boardRow =
                startRow + row;

            const boardCol =
                startCol + col;


            if (
                boardRow >= BOARD_SIZE ||
                boardCol >= BOARD_SIZE
            ) {

                return false;

            }


            if (
                board[boardRow][boardCol] === 1
            ) {

                return false;

            }

        }

    }

    return true;

}


// =========================
// CLEAR LINES
// =========================

function clearLines() {

    let linesCleared = 0;


    // Rows

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        if (
            board[row].every(
                cell => cell === 1
            )
        ) {

            board[row] =
                Array(
                    BOARD_SIZE
                ).fill(0);

            linesCleared++;

        }

    }


    // Columns

    for (
        let col = 0;
        col < BOARD_SIZE;
        col++
    ) {

        let fullColumn = true;

        for (
            let row = 0;
            row < BOARD_SIZE;
            row++
        ) {

            if (
                board[row][col] === 0
            ) {

                fullColumn = false;

                break;

            }

        }


        if (
            fullColumn
        ) {

            for (
                let row = 0;
                row < BOARD_SIZE;
                row++
            ) {

                board[row][col] = 0;

            }

            linesCleared++;

        }

    }

    return linesCleared;

}


// =========================
// RENDER BOARD
// =========================

function renderBoard() {

    const cells =
        document.querySelectorAll(
            ".board-cell"
        );

    cells.forEach(cell => {

        const row =
            Number(
                cell.dataset.row
            );

        const col =
            Number(
                cell.dataset.col
            );

        if (
            board[row][col] === 1
        ) {

            cell.classList.add(
                "filled"
            );

        } else {

            cell.classList.remove(
                "filled"
            );

        }

    });

}


// =========================
// UPDATE SCORE
// =========================

function updateScore() {

    scoreDisplay.textContent =
        score;

    comboDisplay.textContent =
        combo;

}


// =========================
// CHECK POSSIBLE MOVE
// =========================

function hasPossibleMove() {

    for (
        const piece
        of pieces
    ) {

        for (
            let row = 0;
            row < BOARD_SIZE;
            row++
        ) {

            for (
                let col = 0;
                col < BOARD_SIZE;
                col++
            ) {

                if (
                    canPlace(
                        piece.shape,
                        row,
                        col
                    )
                ) {

                    return true;

                }

            }

        }

    }

    return false;

}


// =========================
// RESTART
// =========================

restartButton.addEventListener(
    "click",
    startGame
);


// START GAME

startGame();
