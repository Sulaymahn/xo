var x = {
    name: "Player 1 (X)",
    color: "#ffffff",
    val: 0,
    isAI: false,
    shape: () => {
        const shape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute("points", "170 123.74 123.76 169.99 85.01 131.25 46.26 170 0.01 123.76 38.75 85.01 0 46.26 46.24 0.01 85 38.75 123.74 0 169.99 46.24 131.25 84.99 170 123.74");
        shape.appendChild(poly);
        shape.setAttribute("viewBox", "0 0 170 170");
        shape.setAttribute("height", "64");
        shape.setAttribute("width", "64");
        shape.setAttribute("fill", x.color);
        return shape;
    }
};
var o = {
    name: "Player 2 (O)",
    color: "#168BF2",
    val: 1,
    isAI: false,
    shape: () => {
        const shape = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "path");
        poly.setAttribute("d", "M85,0a85,85,0,1,0,85,85A85,85,0,0,0,85,0Zm0,111.85A26.88,26.88,0,1,1,111.85,85,26.87,26.87,0,0,1,85,111.85Z");
        shape.appendChild(poly);
        shape.setAttribute("viewBox", "0 0 170 170");
        shape.setAttribute("height", "64");
        shape.setAttribute("width", "64");
        shape.setAttribute("fill", o.color);
        return shape;
    }
};
var winner = "";
var xTurn = true;
var gameFinished = false;
const message = document.getElementById("game-message");
const slots = document.getElementsByClassName("tic-slot");
const slot_count = slots.length;
const emptySlot = -5;
const board = [
    [emptySlot, emptySlot, emptySlot],
    [emptySlot, emptySlot, emptySlot],
    [emptySlot, emptySlot, emptySlot]
];

const winConditions = [
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }], // top right
    [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }], // bottom left
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // y left
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], // y middle
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }], // y right
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }], // x top
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }], // x middle
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }], // x bottom
]

function findSlot(coord) {
    for (let i = 0; i < slot_count; i++) {
        if (slots[i].getAttribute("x") == coord.x && slots[i].getAttribute("y") == coord.y) {
            return slots[i];
        }
    }
}

function setup() {
    for (let i = 0; i < slot_count; i++) {
        slots[i].addEventListener("click", () => {
            play({ x: slots[i].getAttribute('x'), y: slots[i].getAttribute('y') });
        });
    }
}

function reset() {
    for (let i = 0; i < slot_count; i++) {
        slots[i].innerHTML = "";
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = emptySlot;
        }
    }
    gameFinished = false;
    xTurn = true;
    message.innerText = "";
}

function printBoard() {
    console.log(board);
}

function play(coord) {
    if (!gameFinished && board[coord.x][coord.y] == emptySlot) {
        board[coord.x][coord.y] = xTurn ? x.val : o.val;
        const elm = xTurn ? x.shape() : o.shape();
        findSlot(coord).appendChild(elm);
        xTurn = !xTurn;

        evaluate();
    }
}

function evaluate() {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const agg = board[condition[0].x][condition[0].y] + board[condition[1].x][condition[1].y] + board[condition[2].x][condition[2].y];
        
        if (agg == x.val * 3) {
            winner = x.name + " won!";
            gameFinished = true;
        }
        else if (agg == o.val * 3) {
            winner = o.name + " won!";
            gameFinished = true;
        }

        if(gameFinished){
            message.innerText = winner;
            return;
        }
    }

    if (!board.flatMap(s => s).includes(emptySlot)) {
        winner = "Game ended as draw";
        gameFinished = true;
        message.innerText = winner;
    }
}