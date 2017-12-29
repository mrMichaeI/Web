var fieldWidth = 1000;
var fieldHeight = 1000;
var field = createArray(fieldWidth);
var cloneField = createArray(fieldWidth);

var c = document.getElementById("Canvas1");
var ctx = c.getContext("2d");
ctx.scale(10, 10);
ctx.fillStyle = "MediumSeaGreen";


function fillRandom() {
    // random
    for (var j = 1; j < fieldHeight - 1; j++) {
        // rows
        for (var k = 1; k < fieldWidth - 1; k++) {
            // columns
            field[j][k] = Math.round(Math.random());
        }
    }
}

// Main function
function main() {
    requestId = undefined;
    newField();
    updateField();
    resume();
}

main();

// Resume
function resume() {
    if (!requestId) {
        requestId = window.requestAnimationFrame(main);
    }
}

// Pause
function pause() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
    }
}

// New game
function newGame() {
    fillRandom();
    main();
}


function createArray(rows) {
    var array = [];
    for (var i = 0; i < rows; i++) {
        array[i] = [];
    }
    return array;
}

function newField() {
    // clear field
    ctx.clearRect(0, 0, fieldHeight, fieldWidth);

    // rows
    for (var j = 1; j < fieldHeight; j++) {
        // columns
        for (var k = 1; k < fieldWidth; k++) {
            if (field[j][k] === 1) {
                ctx.fillRect(j, k, 1, 1);
            }
        }
    }
}

function updateField() {
    // one iteration update
    for (var j = 1; j < fieldHeight - 1; j++) {
        // rows
        for (var k = 1; k < fieldWidth - 1; k++) {
            // columns
            var allCells = 0;
            
            allCells += field[j - 1][k - 1]; //top left
            allCells += field[j - 1][k]; // top center
            allCells += field[j - 1][k + 1]; // top right
            allCells += field[j][k - 1]; // middle left
            allCells += field[j][k + 1]; // middle right
            allCells += field[j + 1][k - 1]; // bottom left
            allCells += field[j + 1][k]; // bottom center
            allCells += field[j + 1][k + 1]; // bottom right

            // Rules
            switch (allCells)
            {
                case 2:
                    cloneField[j][k] = field[j][k];
                    break;
                case 3:
                    cloneField[j][k] = 1;
                    break;
                default:
                    cloneField[j][k] = 0;
            }
        }
    }
    
    for (var l = 1; l < fieldHeight - 1; l++) {
        // iteration
        // bottom & top
        cloneField[l][0] = cloneField[l][fieldHeight - 3];
        cloneField[l][fieldHeight - 2] = cloneField[l][1];
        // left & right
        cloneField[0][l] = cloneField[fieldHeight - 3][l];
        cloneField[fieldHeight - 2][l] = cloneField[1][l];
    }

    var temp = field;
    field = cloneField;
    cloneField = temp;
}


// Buttons
document.getElementById('NewGame').onclick = newGame;
document.getElementById('pause').onclick = pause;
document.getElementById('resume').onclick = main;