const BOARD_SIZE = 8;

const POINTS_PER_BLOCK = 10;

const gameBoard =
    document.getElementById(
        "gameBoard"
    );

const pieceContainer =
    document.getElementById(
        "pieceContainer"
    );

const scoreDisplay =
    document.getElementById(
        "score"
    );

const comboDisplay =
    document.getElementById(
        "combo"
    );

const gameMessage =
    document.getElementById(
        "gameMessage"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );

let board = [];

let score = 0;

let combo = 0;

let placementsWithoutClear = 0;

let selectedPiece = null;

let pieces = [];


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

    // L shape
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

    // Another L
    [
        [1, 1, 1],
        [1, 0, 0]
    ],

    // Reverse L
    [
        [1, 1, 1],
        [0, 0, 1]
    ],

    // T shape
    [
        [1, 1, 1],
        [0, 1, 0]
    ],

    // T shape rotated
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
        "Choose a block 💕";

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
                document.createElement(
                    "div"
                );

            cell.classList.add(
                "board-cell"
            );

            cell.dataset.row = row;

            cell.dataset.col = col;

            cell.addEventListener(
                "click",
                function() {

                    placePiece(
                        row,
                        col
                    );

                }
            );

            gameBoard.appendChild(
                cell
            );

        }

    }

}


// =========================
// GENERATE 3 PIECES
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

            shape:
                randomShape,

            id:
                i

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
        document.createElement(
            "div"
        );

    pieceElement.classList.add(
        "piece"
    );

    pieceElement.style.gridTemplateColumns =
        `repeat(${piece.shape[0].length}, 20px)`;

    piece.shape.forEach(
        function(row) {

            row.forEach(
                function(cell) {

                    const block =
                        document.createElement(
                            "div"
                        );

                    if (cell === 1) {

                        block.classList.add(
                            "piece-cell"
                        );

                    }

                    pieceElement.appendChild(
                        block
                    );

                }
            );

        }
    );

    pieceElement.addEventListener(
        "click",
        function() {

            selectedPiece = piece;

            document
                .querySelectorAll(
                    ".piece"
                )
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

            gameMessage.textContent =
                "Now choose where to place it 💕";

        }
    );

    pieceContainer.appendChild(
        pieceElement
    );

}


// =========================
// PLACE PIECE
// =========================

function placePiece(
    startRow,
    startCol
) {

    if (
        !selectedPiece
    ) {

        gameMessage.textContent =
            "Choose a block first 💕";

        return;

    }

    const shape =
        selectedPiece.shape;

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


    // Placement points
    score +=
        blockCount *
        POINTS_PER_BLOCK;


    // Remove selected piece
    pieces =
        pieces.filter(
            piece =>
                piece.id !==
                selectedPiece.id
        );

    selectedPiece = null;


    const clearedLines =
        clearLines();


    if (
        clearedLines > 0
    ) {

        combo++;

        placementsWithoutClear = 0;

        const clearPoints =
            clearedLines *
            8 *
            combo;

        score += clearPoints;

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
// CAN PLACE?
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
// CHECK MOVES
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
// Start
startGame();
