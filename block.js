const BOARD_SIZE = 8;
const POINTS_PER_BLOCK = 100;

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

let draggedPiece = null;
let draggedElement = null;

let gameOverState = false;

let dragOffsetX = 0;
let dragOffsetY = 0;

let ghostCells = [];

// =========================
// BLOCK SHAPE
// =========================

const SHAPES = [

    // 2x2
    [
        [1,1],
        [1,1]
    ],

    // 3x3
    [
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ],

    // Horizontal 3
    [
        [1,1,1]
    ],

    // Horizontal 4
    [
        [1,1,1,1]
    ],

    // Horizontal 5
    [
        [1,1,1,1,1]
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

    // L left
    [
        [1,0],
        [1,0],
        [1,1]
    ],

    // L right
    [
        [0,1],
        [0,1],
        [1,1]
    ],

    // L horizontal
    [
        [1,1,1],
        [1,0,0]
    ],

    // Reverse L horizontal
    [
        [1,1,1],
        [0,0,1]
    ],

    // T
    [
        [1,1,1],
        [0,1,0]
    ],

    // T vertical
    [
        [0,1],
        [1,1],
        [0,1]
    ]

];


// =========================
// START GAME
// =========================

function startGame(){

    board = [];

    score = 0;
    combo = 0;
    placementsWithoutClear = 0;

    pieces = [];

    selectedPiece = null;

    draggedPiece = null;
    draggedElement = null;

    gameOverState = false;


    for(let r = 0; r < BOARD_SIZE; r++){

        board[r] = [];

        for(let c = 0; c < BOARD_SIZE; c++){

            board[r][c] = 0;

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

function createBoard(){

    gameBoard.innerHTML = "";


    for(let r = 0; r < BOARD_SIZE; r++){

        for(let c = 0; c < BOARD_SIZE; c++){


            const cell =
                document.createElement("div");


            cell.classList.add(
                "board-cell"
            );


            cell.dataset.row = r;
            cell.dataset.col = c;


            gameBoard.appendChild(cell);


        }

    }

}



// =========================
// GENERATE PIECES
// =========================

function generatePieces(){


    pieces = [];

    pieceContainer.innerHTML = "";


    for(let i = 0; i < 3; i++){


        const shape =
            SHAPES[
                Math.floor(
                    Math.random() * SHAPES.length
                )
            ];


        const piece = {

            id: Date.now() + i,

            shape: shape

        };


        pieces.push(piece);


        displayPiece(piece);


    }

}



// =========================
// DISPLAY PIECE
// =========================

function displayPiece(piece){


    const pieceElement =
        document.createElement("div");


    pieceElement.classList.add(
        "piece"
    );


    pieceElement.dataset.id =
        piece.id;



    pieceElement.style.gridTemplateColumns =
        `repeat(${piece.shape[0].length},20px)`;



    piece.shape.forEach(row => {


        row.forEach(cell => {


            const block =
                document.createElement("div");


            if(cell === 1){


                block.classList.add(
                    "piece-cell"
                );


            }


            pieceElement.appendChild(
                block
            );


        });


    });



    // EVERY PIECE CAN DRAG

    pieceElement.addEventListener(
        "pointerdown",
        function(event){


            event.preventDefault();


            selectedPiece = piece;


            startDragging(
                event,
                pieceElement,
                piece
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

function startDragging(event, pieceElement, piece){

    clearGhost();

    if(gameOverState) return;


    const rect = pieceElement.getBoundingClientRect();


    const x = event.clientX;
    const y = event.clientY;


    // find where player grabbed inside the piece
    dragOffsetX =
        Math.floor(
            (x - rect.left) / 28
        );


    dragOffsetY =
        Math.floor(
            (y - rect.top) / 28
        );

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
        {
            once:true
        }
    );

}


// =========================
// CREATE DRAG PREVIEW
// =========================

function createDraggedPiece(piece){


    const element =
        document.createElement("div");


    element.classList.add(
        "dragged-piece"
    );


    element.style.gridTemplateColumns =
        `repeat(${piece.shape[0].length},28px)`;



    piece.shape.forEach(row => {


        row.forEach(cell => {


            const block =
                document.createElement("div");


            if(cell === 1){

                block.classList.add(
                    "dragged-piece-cell"
                );

            }


            element.appendChild(
                block
            );


        });


    });


    return element;

}



// =========================
// MOVE DRAGGED PIECE
// =========================

function moveDraggedPiece(event){

    if(!draggedElement) return;



    draggedElement.style.left =
        `${event.clientX - (dragOffsetX * 28)}px`;


    draggedElement.style.top =
        `${event.clientY - (dragOffsetY * 28)}px`;



    const boardRect =
        gameBoard.getBoundingClientRect();


    const cellSize =
        boardRect.width / BOARD_SIZE;



    const col =
        Math.floor(
        (
            event.clientX -
            boardRect.left -
            (dragOffsetX * cellSize)
        )
        /
        cellSize
        );



    const row =
        Math.floor(
        (
            event.clientY -
            boardRect.top -
            (dragOffsetY * cellSize)
        )
        /
        cellSize
        );



    showGhost(
        row,
        col,
        draggedPiece
    );

}



// =========================
// STOP DRAGGING
// =========================

function stopDragging(event){

    clearGhost();

    if(!draggedPiece) return;



    const boardRect =
        gameBoard.getBoundingClientRect();



    const cellSize =
        boardRect.width / BOARD_SIZE;



    const col =
Math.floor(
(
event.clientX -
boardRect.left -
(dragOffsetX * cellSize)
)
/
cellSize
);


const row =
Math.floor(
(
event.clientY -
boardRect.top -
(dragOffsetY * cellSize)
)
/
cellSize
);


    if(
        row >= 0 &&
        row < BOARD_SIZE &&
        col >= 0 &&
        col < BOARD_SIZE
    ){


        placePiece(
            row,
            col,
            draggedPiece
        );


    }



    if(draggedElement){

        draggedElement.remove();

    }



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
){


    const shape =
        piece.shape;



    if(
        !canPlace(
            shape,
            startRow,
            startCol
        )
    ){

        gameMessage.textContent =
            "Cannot place here 💔";

        return;

    }



    let blockCount = 0;



    for(let r = 0; r < shape.length; r++){


        for(let c = 0; c < shape[r].length; c++){


            if(shape[r][c] === 1){


                board[startRow+r][startCol+c] = 1;


                blockCount++;


            }


        }


    }



    // Placement points

    score +=
        blockCount *
        POINTS_PER_BLOCK;



    pieces =
    pieces.filter(
        p =>
            p.id !== piece.id
    );


// remove used piece from bottom

const usedPiece =
    document.querySelector(
        `.piece[data-id="${piece.id}"]`
    );


if(usedPiece){

    usedPiece.remove();

}



    const cleared =
        clearLines();



    if(cleared > 0){


        combo++;


        placementsWithoutClear = 0;



        score +=
            cleared *
            BOARD_SIZE *
            combo;



        gameMessage.textContent =
            `${cleared} line cleared 🔥 Combo ${combo}`;


    }
    else{


        placementsWithoutClear++;


        if(placementsWithoutClear >= 3){


            combo = 0;

            placementsWithoutClear = 0;


            gameMessage.textContent =
                "Combo lost 💔";


        }


    }



    updateScore();

    renderBoard();



    if(pieces.length === 0){

        generatePieces();

    }



    if(!hasPossibleMove()){


        gameOverState = true;


        gameMessage.textContent =
        `Game Over 💔 Score: ${score}`;


    }


}



// =========================
// CAN PLACE
// =========================

function canPlace(shape,row,col){


    for(let r = 0; r < shape.length; r++){


        for(let c = 0; c < shape[r].length; c++){


            if(shape[r][c] === 0)
                continue;



            let boardRow =
                row+r;


            let boardCol =
                col+c;



            if(
                boardRow >= BOARD_SIZE ||
                boardCol >= BOARD_SIZE
            ){

                return false;

            }



            if(
                board[boardRow][boardCol] === 1
            ){

                return false;

            }


        }


    }


    return true;

}



// =========================
// CLEAR ROW + COLUMN
// =========================

function clearLines(){


    let count = 0;



    for(let r = 0; r < BOARD_SIZE; r++){


        if(
            board[r].every(
                cell => cell === 1
            )
        ){

            board[r] =
            Array(BOARD_SIZE).fill(0);


            count++;

        }


    }




    for(let c = 0; c < BOARD_SIZE; c++){


        let full = true;



        for(let r = 0; r < BOARD_SIZE; r++){


            if(board[r][c] === 0){

                full = false;

                break;

            }

        }



        if(full){


            for(let r = 0; r < BOARD_SIZE; r++){

                board[r][c] = 0;

            }


            count++;

        }


    }



    return count;

}



// =========================
// RENDER BOARD
// =========================

function renderBoard(){


    document
    .querySelectorAll(".board-cell")
    .forEach(cell => {


        const r =
            Number(cell.dataset.row);


        const c =
            Number(cell.dataset.col);



        if(board[r][c] === 1){


            cell.classList.add(
                "filled"
            );


        }
        else{


            cell.classList.remove(
                "filled"
            );


        }


    });


}



// =========================
// SCORE
// =========================

function updateScore(){


    scoreDisplay.textContent =
        score;


    comboDisplay.textContent =
        combo;


}



// =========================
// CHECK MOVE
// =========================

function hasPossibleMove(){


    for(const piece of pieces){


        for(let r = 0; r < BOARD_SIZE; r++){


            for(let c = 0; c < BOARD_SIZE; c++){


                if(
                    canPlace(
                        piece.shape,
                        r,
                        c
                    )
                ){

                    return true;

                }


            }


        } 


    }


    return false;

}

function showGhost(row, col, piece){

    clearGhost();


    const shape = piece.shape;


    for(
        let r = 0;
        r < shape.length;
        r++
    ){

        for(
            let c = 0;
            c < shape[r].length;
            c++
        ){


            if(shape[r][c] === 1){


                const targetRow =
                    row + r;


                const targetCol =
                    col + c;



                if(
                    targetRow >= 0 &&
                    targetRow < BOARD_SIZE &&
                    targetCol >= 0 &&
                    targetCol < BOARD_SIZE
                ){

                    const index =
                        targetRow * BOARD_SIZE +
                        targetCol;


                    const cell =
                        document.querySelectorAll(
                            ".board-cell"
                        )[index];


                    cell.classList.add(
                        "ghost"
                    );


                    ghostCells.push(cell);

                }


            }

        }

    }

}

function clearGhost(){

    ghostCells.forEach(
        cell => {

            cell.classList.remove(
                "ghost"
            );

        }
    );


    ghostCells = [];

}

// =========================
// RESTART
// =========================

restartButton.addEventListener(
    "click",
    startGame
);



// START

startGame();
