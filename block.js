const BOARD_SIZE = 8;
const POINTS_PER_BLOCK = 10;

const gameBoard =
    document.getElementById("gameBoard");

const pieceContainer =
    document.getElementById("pieceContainer");

const scoreDisplay =
    document.getElementById("score");

const comboDisplay =
    document.getElementById("combo");

const gameMessage =
    document.getElementById("gameMessage");

const restartButton =
    document.getElementById("restartButton");


// =========================
// GAME VARIABLES
// =========================

let board = [];

let score = 0;

let combo = 0;

let placementsWithoutClear = 0;

let selectedPiece = null;

let pieces = [];

let draggedPiece = null;

let dragPreview = null;

let gameOverState = false;


// =========================
// BLOCK SHAPES
// =========================

const SHAPES = [

    // 2x2 SQUARE
    [
        [1, 1],
        [1, 1]
    ],

    // 3x3 SQUARE
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ],

    // HORIZONTAL 3
    [
        [1, 1, 1]
    ],

    // HORIZONTAL 4
    [
        [1, 1, 1, 1]
    ],

    // HORIZONTAL 5
    [
        [1, 1, 1, 1, 1]
    ],

    // VERTICAL 3
    [
        [1],
        [1],
        [1]
    ],

    // VERTICAL 4
    [
        [1],
        [1],
        [1],
        [1]
    ],

    // VERTICAL 5
    [
        [1],
        [1],
        [1],
        [1],
        [1]
    ],

    // L SHAPE
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],

    // REVERSE L
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],

    // L HORIZONTAL
    [
        [1, 1, 1],
        [1, 0, 0]
    ],

    // REVERSE L HORIZONTAL
    [
        [1, 1, 1],
        [0, 0, 1]
    ],

    // T SHAPE
    [
        [1, 1, 1],
        [0, 1, 0]
    ],

    // VERTICAL T SHAPE
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

    gameOverState = false;


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
                document.createElement("div");


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
                Date.now() +
                Math.random()

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


    pieceElement.classList.add(
        "piece"
    );


    pieceElement.style.gridTemplateColumns =
        `repeat(
            ${piece.shape[0].length},
            20px
        )`;


    piece.shape.forEach(
        function(row) {

            row.forEach(
                function(cell) {

                    const block =
                        document.createElement(
                            "div"
                        );


                    if (
                        cell === 1
                    ) {

                        block.classList.add(
                            "piece-cell"
                        );

                    } else {

                        block.classList.add(
                            "empty-cell"
                        );

                    }


                    pieceElement.appendChild(
                        block
                    );

                }
            );

        }
    );


    // =========================
    // CLICK SELECT
    // =========================

    pieceElement.addEventListener(
        "click",
        function() {

            if (
                gameOverState
            ) return;


            selectedPiece =
                piece;


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


    // =========================
    // MOUSE DRAG START
    // =========================

    pieceElement.addEventListener(
        "mousedown",
        function(event) {

            if (
                gameOverState
            ) return;


            event.preventDefault();


            selectedPiece =
                piece;


            draggedPiece =
                piece;


            pieceElement.classList.add(
                "dragging"
            );


            createDragPreview();


            moveDragPreview(
                event.clientX,
                event.clientY
            );

        }
    );


    // =========================
    // TOUCH DRAG START
    // =========================

    pieceElement.addEventListener(
        "touchstart",
        function(event) {

            if (
                gameOverState
            ) return;


            event.preventDefault();


            selectedPiece =
                piece;


            draggedPiece =
                piece;


            const touch =
                event.touches[0];


            createDragPreview();


            moveDragPreview(
                touch.clientX,
                touch.clientY
            );

        },
        {
            passive: false
        }
    );


    pieceContainer.appendChild(
        pieceElement
    );

}


// =========================
// CREATE DRAG PREVIEW
// =========================

function createDragPreview() {

    if (
        dragPreview
    ) {

        dragPreview.remove();

    }


    dragPreview =
        document.createElement(
            "div"
        );


    dragPreview.classList.add(
        "drag-preview"
    );


    dragPreview.style.gridTemplateColumns =
        `repeat(
            ${draggedPiece.shape[0].length},
            20px
        )`;


    draggedPiece.shape.forEach(
        function(row) {

            row.forEach(
                function(cell) {

                    const block =
                        document.createElement(
                            "div"
                        );


                    if (
                        cell === 1
                    ) {

                        block.classList.add(
                            "piece-cell"
                        );

                    } else {

                        block.classList.add(
                            "empty-cell"
                        );

                    }


                    dragPreview.appendChild(
                        block
                    );

                }
            );

        }
    );


    document.body.appendChild(
        dragPreview
    );

}


// =========================
// MOVE DRAG PREVIEW
// =========================

function moveDragPreview(
    x,
    y
) {

    if (
        !dragPreview
    ) return;


    dragPreview.style.left =
        `${x}px`;


    dragPreview.style.top =
        `${y}px`;

}


// =========================
// MOUSE MOVEMENT
// =========================

document.addEventListener(
    "mousemove",
    function(event) {

        if (
            !draggedPiece
        ) return;


        moveDragPreview(
            event.clientX,
            event.clientY
        );

    }
);


// =========================
// TOUCH MOVEMENT
// =========================

document.addEventListener(
    "touchmove",
    function(event) {

        if (
            !draggedPiece
        ) return;


        event.preventDefault();


        const touch =
            event.touches[0];


        moveDragPreview(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: false
    }
);


// =========================
// MOUSE DRAG END
// =========================

document.addEventListener(
    "mouseup",
    function(event) {

        if (
            !draggedPiece
        ) return;


        finishDrag(
            event.clientX,
            event.clientY
        );

    }
);


// =========================
// TOUCH DRAG END
// =========================

document.addEventListener(
    "touchend",
    function(event) {

        if (
            !draggedPiece
        ) return;


        const touch =
            event.changedTouches[0];


        finishDrag(
            touch.clientX,
            touch.clientY
        );

    }
);


// =========================
// FINISH DRAG
// =========================

function finishDrag(
    x,
    y
) {

    const boardRect =
        gameBoard.getBoundingClientRect();


    const cellSize =
        boardRect.width /
        BOARD_SIZE;


    const col =
        Math.floor(
            (
                x -
                boardRect.left
            ) /
            cellSize
        );


    const row =
        Math.floor(
            (
                y -
                boardRect.top
            ) /
            cellSize
        );


    if (
        row >= 0 &&
        row < BOARD_SIZE &&
        col >= 0 &&
        col < BOARD_SIZE
    ) {

        placePiece(
            row,
            col
        );

    }


    if (
        dragPreview
    ) {

        dragPreview.remove();

        dragPreview =
            null;

    }


    draggedPiece =
        null;

}


// =========================
// PLACE PIECE
// =========================

function placePiece(
    startRow,
    startCol
) {

    if (
        gameOverState
    ) return;


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


    let blockCount =
        0;


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


    // =========================
    // PLACEMENT POINTS
    // =========================

    score +=
        blockCount *
        POINTS_PER_BLOCK;


    // =========================
    // REMOVE USED PIECE
    // =========================

    pieces =
        pieces.filter(
            piece =>
                piece.id !==
                selectedPiece.id
        );


    selectedPiece =
        null;


    // =========================
    // CLEAR LINES
    // =========================

    const clearedLines =
        clearLines();


    if (
        clearedLines > 0
    ) {

        combo++;

        placementsWithoutClear =
            0;


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

            combo =
                0;


            placementsWithoutClear =
                0;


            gameMessage.textContent =
                "Combo lost 💔";

        }

    }


    updateScore();

    renderBoard();


    // =========================
    // REFRESH PIECES
    // =========================

    if (
        pieces.length === 0
    ) {

        generatePieces();

    } else {

        pieceContainer.innerHTML =
            "";


        pieces.forEach(
            function(piece) {

                displayPiece(
                    piece
                );

            }
        );


        // Add a new piece
        const randomShape =
            SHAPES[
                Math.floor(
                    Math.random() *
                    SHAPES.length
                )
            ];


        const newPiece = {

            shape:
                randomShape,

            id:
                Date.now() +
                Math.random()

        };


        pieces.push(
            newPiece
        );


        displayPiece(
            newPiece
        );

    }


    // =========================
    // CHECK GAME OVER
    // =========================

    if (
        !hasPossibleMove()
    ) {

        gameOverState =
            true;


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
            ) continue;


            const boardRow =
                startRow +
                row;


            const boardCol =
                startCol +
                col;


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

    let linesCleared =
        0;


    // ROWS

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


    // COLUMNS

    for (
        let col = 0;
        col < BOARD_SIZE;
        col++
    ) {

        let fullColumn =
            true;


        for (
            let row = 0;
            row < BOARD_SIZE;
            row++
        ) {

            if (
                board[row][col] === 0
            ) {

                fullColumn =
                    false;

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

                board[row][col] =
                    0;

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
    function() {

        startGame();

    }
);


// =========================
// START
// =========================

startGame();
