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

let draggedPiece = null;
let draggedElement = null;
let previewCells = [];


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

    // L sideways
    [
        [1, 1, 1],
        [1, 0, 0]
    ],

    // Reverse L sideways
    [
        [1, 1, 1],
        [0, 0, 1]
    ],

    // T
    [
        [1, 1, 1],
        [0, 1, 0]
    ],

    // Vertical T
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

    draggedPiece = null;

    draggedElement = null;

    clearPreview();

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        board[row] = [];

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

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

            const cell =
                document.createElement("div");

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
                    Math.random() *
                    SHAPES.length
                )
            ];

        const piece = {

            shape: randomShape,

            id: i

        };

        pieces.push(piece);

        displayPiece(piece);

    }

}


// =========================
// DISPLAY PIECE
// =========================

function displayPiece(piece) {

    const pieceElement =
        document.createElement("div");

    pieceElement.classList.add("piece");

    pieceElement.style.gridTemplateColumns =
        `repeat(${piece.shape[0].length}, 20px)`;

    piece.shape.forEach(
        function(row) {

            row.forEach(
                function(cell) {

                    const block =
                        document.createElement("div");

                    if (
                        cell === 1
                    ) {

                        block.classList.add(
                            "piece-cell"
                        );

                    }

                    pieceElement.appendChild(block);

                }

            );

        }

    );

    // POINTER DOWN
    pieceElement.addEventListener(
        "pointerdown",
        function(event) {

            startDrag(
                event,
                piece,
                pieceElement
            );

        }
    );

    pieceContainer.appendChild(
        pieceElement
    );

}


// =========================
// START DRAGGING
// =========================

function startDrag(
    event,
    piece,
    element
) {

    event.preventDefault();

    draggedPiece = piece;

    draggedElement = element;

    draggedElement.classList.add(
        "dragging"
    );

    draggedElement.setPointerCapture(
        event.pointerId
    );

    gameMessage.textContent =
        "Move the block onto the board 💕";

    updateDragPosition(event);

}


// =========================
// MOVE DRAGGED PIECE
// =========================

document.addEventListener(
    "pointermove",
    function(event) {

        if (
            !draggedPiece
        ) {

            return;

        }

        updateDragPosition(event);

    }
);


// =========================
// UPDATE DRAG POSITION
// =========================

function updateDragPosition(event) {

    const boardRect =
        gameBoard.getBoundingClientRect();

    const cellWidth =
        boardRect.width / BOARD_SIZE;

    const cellHeight =
        boardRect.height / BOARD_SIZE;

    const relativeX =
        event.clientX -
        boardRect.left;

    const relativeY =
        event.clientY -
        boardRect.top;

    const col =
        Math.floor(
            relativeX /
            cellWidth
        );

    const row =
        Math.floor(
            relativeY /
            cellHeight
        );

    if (
        row < 0 ||
        col < 0 ||
        row >= BOARD_SIZE ||
        col >= BOARD_SIZE
    ) {

        clearPreview();

        return;

    }

    showPreview(
        row,
        col
    );

}


// =========================
// RELEASE BLOCK
// =========================

document.addEventListener(
    "pointerup",
    function() {

        if (
            !draggedPiece
        ) {

            return;

        }

        const target =
            getPreviewPosition();

        if (
            target &&
            canPlace(
                draggedPiece.shape,
                target.row,
                target.col
            )
        ) {

            placePiece(
                target.row,
                target.col,
                draggedPiece
            );

        } else {

            gameMessage.textContent =
                "That block cannot fit there 💔";

        }

        if (
            draggedElement
        ) {

            draggedElement.classList.remove(
                "dragging"
            );

        }

        draggedPiece = null;

        draggedElement = null;

        clearPreview();

    }
);


// =========================
// PREVIEW
// =========================

function showPreview(
    startRow,
    startCol
) {

    clearPreview();

    if (
        !draggedPiece
    ) {

        return;

    }

    const shape =
        draggedPiece.shape;

    const valid =
        canPlace(
            shape,
            startRow,
            startCol
        );

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
                shape[row][col] !== 1
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

                continue;

            }

            const cell =
                document.querySelector(
                    `.board-cell[data-row="${boardRow}"][data-col="${boardCol}"]`
                );

            if (
                cell
            ) {

                cell.classList.add(
                    valid
                        ? "preview"
                        : "invalid-preview"
                );

                previewCells.push(
                    cell
                );

            }

        }

    }

    lastPreviewPosition = {
        row: startRow,
        col: startCol
    };

}


// =========================
// PREVIEW POSITION
// =========================

let lastPreviewPosition = null;

function getPreviewPosition() {

    return lastPreviewPosition;

}


// =========================
// CLEAR PREVIEW
// =========================

function clearPreview() {

    previewCells.forEach(
        function(cell) {

            cell.classList.remove(
                "preview"
            );

            cell.classList.remove(
                "invalid-preview"
            );

        }

    );

    previewCells = [];

    lastPreviewPosition = null;

}


// =========================
// PLACE PIECE
// =========================

function placePiece(
    startRow,
    startCol,
    piece
) {

    const shape =
        piece.shape;

    if (
        !canPlace(
            shape,
            startRow,
            startCol
        )
    ) {

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

    score +=
        blockCount *
        POINTS_PER_BLOCK;

    pieces =
        pieces.filter(
            currentPiece =>
                currentPiece.id !==
                piece.id
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

        score +=
            clearPoints;

        gameMessage.textContent =
            `Amazing! ${clearedLines} line(s) cleared 🔥 Combo ${combo}`;

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
                boardRow < 0 ||
                boardCol < 0 ||
                boardRow >= BOARD_SIZE ||
                boardCol >= BOARD_SIZE
            ) {

                return false;

            }

            if (
                board[
                    boardRow
                ][
                    boardCol
                ] === 1
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

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        if (
            board[row].every(
                cell =>
                    cell === 1
            )
        ) {

            board[row] =
                Array(
                    BOARD_SIZE
                ).fill(0);

            linesCleared++;

        }

    }

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

    cells.forEach(
        function(cell) {

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

        }

    );

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


// =========================
// START
// =========================

startGame();
