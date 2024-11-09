
const DEF_BACK_COLOR = "#ffe9d0";
const TABLE_WIDTH = 10;
const TABLE_HEIGHT = 20;

//name, color, startPosition
const START_FIGURES = [
    ["_","cyan", [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]]],            //if (i==0) matrix -> 4x4
    ["L","blue", [[0,0,0],[1,0,0],[1,1,1]]],
    ["RL","coral", [[0,0,0],[0,0,1],[1,1,1]]],
    ["SQ","gold", [[0,0,0],[0,1,1],[0,1,1]]],
    ["S","lightgreen", [[0,0,0],[0,1,1],[1,1,0]]],
    ["RT","mediumpurple", [[0,0,0],[0,1,0],[1,1,1]]],
    ["Z","red", [[0,0,0],[1,1,0],[0,1,1]]]
];

function randomNumber(n) {
    let res = Math.floor(Math.random() * n);
    while (!(res in userFiguresIndexes)) {
        res = Math.floor(Math.random() * n);
    }
    return res;
}

let random;
let nextFig;
let curFig;
let allFields = [];
let userFiguresIndexes = [];
let scoredRows = 0;
let mode = 900;
let level;
let tabeleKorisnickihFigura = [];

function endGame() {
    localStorage.setItem("scoredRows", JSON.stringify(scoredRows));
    window.location.href = "tetris-rezultati.html";
}

function fillCell(cellID, color) {
    if (cellID < 0) {
        return;
    }
    $("td#" + cellID).css("background-color", color);
}

function drawAllFields() {
    for (let i=0; i<TABLE_HEIGHT; i++) {
        for (let j=0; j<TABLE_WIDTH; j++) {
            fillCell(i*TABLE_WIDTH + j, allFields[i][j][1]);
        }
    }
}

function showSideBar(index) {
    $("#poeni").text(scoredRows);
    if (level == 3) {
        $("#level").text("lako");
    } else if (level == 2) {
        $("#level").text("srednje");
    } else if (level == 1) {
        $("#level").text("teško");
    } 
    $("#sledeca").empty();
    $("#sledeca").append(tabeleKorisnickihFigura[index]);
}
function initTabeleKorisnickihFigura() {
    let tabela;
    let dim;
    for (let k = 0; k<7; k++) {
        if (!(userFiguresIndexes).includes(k)) {
            continue;
        }
        tabela = $("<table></table>");
        dim = START_FIGURES[k][2].length;
        for (let i=0; i<dim; i++) {
            let row = $("<tr></tr>");
            for (let j=0; j<dim; j++) {
                let curClr = DEF_BACK_COLOR;
                if (START_FIGURES[k][2][i][j] == 1) {
                    curClr = START_FIGURES[k][1];
                }
                let cell = $("<td></td>").css({                      
                    "width" : "30px",        
                    "height" : "30px",
                    "background-color" : curClr,
                    "box-shadow" : "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.3)"
                });
                row.append(cell);
            }
            tabela.append(row).attr("id", "sledeca").css({"margin" : "auto", "border-collapse" : "collapse"});
        } 
        tabeleKorisnickihFigura[k] = tabela;
    }
}

class Figure {
    constructor(x, y, startLook) {
        this.x = x;
        this.y = y;
        this.startLook = startLook;
    }
    startLook;              //wholeStartBlock = START_FIGURES[i]!
    canMove = 1;

    draw(toDraw) {
        let color;
        if (toDraw) {
            color = this.startLook[1];
        } else {
            color = DEF_BACK_COLOR;
        }
        let matrix = this.startLook[2];
        for (let i = 0; i<matrix.length; i++) {
            for (let j = 0; j<matrix[i].length; j++) {
                if (matrix[i][j] == 0) continue;
                fillCell((this.y + i) * TABLE_WIDTH + (this.x + j), color);
            }
        }
    }
    moveRight() {
        if (!this.canMove) {
            return;
        }
        this.draw(0);
        this.x++;
        this.draw(1);
    }
    moveLeft() {
        if (!this.canMove) {
            return;
        }
        this.draw(0);
        this.x--;
        this.draw(1);
    }
    moveDown() {
        if (!this.canMove) {
            if(this.y<0) endGame();
            return;
        }
        this.draw(0);
        this.y++;
        this.draw(1);
    }
    rotate() {
        if (!this.canMove) {
            return;
        }
        this.draw(0);
        this.startLook[2] = rotateMatrixClockwise(this.startLook[2]);
        this.draw(1);
    }
    willHit(direction) {                    //"r", "l" or "d"
        let x = this.x;
        let y = this.y;
        let matrix = this.startLook[2];
        if (direction == "rotate") {
            matrix = rotateMatrixClockwise(matrix);
        } else if (direction == "r") {
            x++;
        } else if (direction == "l") {
            x--;
        } else if (direction == "d") {
            y++;
        }
        for (let i=0; i<matrix.length; i++) {
            for (let j=0; j<matrix.length; j++) {
                if (matrix[i][j] == 0) {
                    continue;
                }
                if (x + j >= TABLE_WIDTH) {
                    return 1;
                }
                if (x + j < 0) {
                    return 1;
                }
                if (y + i < 0) {
                    continue;
                }
               
                //this.startLook[2][i][j] == 1
                if (y + i >= TABLE_HEIGHT) {
                    return -1;
                }
                
                if (allFields[y+i][x+j][0] == 1) {
                    return -1;
                }
            }
        }
        return 0;
    }
    blockFigure() {
        if (this.y<0) { 
            endGame();
        }
        let matrix = this.startLook[2];
        for (let i=0; i<matrix.length; i++) {
            for (let j=0; j<matrix.length; j++) {
                if (matrix[i][j] == 1) {
                    allFields[this.y + i][this.x + j][0] = 1;
                    allFields[this.y + i][this.x + j][1] = this.startLook[1];
                }
            }
        }
        this.canMove = 0;
        drawAllFields();
        checkForRows();                                             //skloni popunjene linije
        curFig = nextFig;
        random = randomNumber(7);
        nextFig = new Figure(3, -3, START_FIGURES[random]);
        showSideBar(random);
        curFig.draw(1);
    }
}
function rotateMatrixClockwise(matrix) {    
    if (matrix.length !== 3 && matrix.length !== 4) {
      alert("Lose zadata figura!");
    }
    let result = [];
    for (let i = 0; i<matrix.length; i++) {
        result[i] = [];
        for (let j = 0; j<matrix.length; j++) {
            result[i][j] = 0;
        }
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        result[j][matrix.length - 1 - i] = matrix[i][j];
      }
    }
    
    return result;
  }

function checkForRows() {
    for (let i=0; i<TABLE_HEIGHT; i++) {
        let flag = 1;
        for (let j=0; j<TABLE_WIDTH; j++) {
            if (allFields[i][j][0] == 0) {
                flag = 0;
                break;
            }
        }
        if (flag) {
            scoredRows++;
            for (let k=i; k>0; k--) {
                for (let a=0; a<TABLE_WIDTH; a++) {
                    allFields[k][a][0] = allFields[k-1][a][0];
                    allFields[k][a][1] = allFields[k-1][a][1];
                }
            }
            drawAllFields();
        }
    }
    console.log(scoredRows);
}

function makeTable() {
    for (let i=0; i<TABLE_HEIGHT; i++) {
        allFields[i] = [];
        let row = $("<tr></tr>");
        for (let j=0; j<TABLE_WIDTH; j++) {
            allFields[i][j] = [];
            allFields[i][j][0] = 0; 
            allFields[i][j][1] = DEF_BACK_COLOR;
            let cell = $("<td></td>").attr("id", i*TABLE_WIDTH + j).css({                      
                "width" : "30px",        
                "height" : "30px",
                "background-color" : DEF_BACK_COLOR,
                "text-align" : "center",
                "box-shadow" : "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.3)"
            });
            row.append(cell);
        }
        $("#table").append(row);
    }
    showSideBar();
}

function timerDown() {
    let code = curFig.willHit("d");
    if (code == 0) {
        curFig.moveDown();
    } else if (code == -1) {
        curFig.blockFigure();
    }
    setTimeout(timerDown, mode);
}

function startGame() {
    initTabeleKorisnickihFigura();
    random = randomNumber(7)
    curFig = new Figure(3, -3, START_FIGURES[randomNumber(7)]);
    nextFig = new Figure(3, -3, START_FIGURES[random]);
    curFig.draw(1);
    showSideBar(random);

    //endGame();

    setInterval(function() {
        mode = Math.max(mode-50, 100);
    }, 15000);

    timerDown();
    
    document.addEventListener("keydown", function(event){
        if(event.code === 'KeyD' || event.code === 'ArrowRight'){
            let code = curFig.willHit("r");
            if (code == 0) {
                curFig.moveRight();
            } /*else if (code == -1) {
                curFig.blockFigure();
            }*/
        } else if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
            let code = curFig.willHit("l");
            if (code == 0) {
                curFig.moveLeft();
            } /*else if (code == -1) {
                curFig.blockFigure();
            }*/
        } else if (event.code === 'KeyS' || event.code === 'ArrowDown') {
            let code = curFig.willHit("d");
            if (code == 0) {
                curFig.moveDown();
            } else if (code == -1) {
                curFig.blockFigure();
            }
        } else if (event.code === 'KeyW' || event.code === 'ArrowUp') {
            let code = curFig.willHit("rotate");
            if (code == 0) {
                curFig.rotate();
            } /*else if (code == -1) {
                curFig.blockFigure();
            }*/
        }
    });
}

function loadPickedFigures() {
    let cur = userFiguresIndexes = localStorage.getItem("userFiguresIndexes");      
    userFiguresIndexes = JSON.parse(cur);       
}

function loadMode() {
    level = localStorage.getItem("mode");      
    mode = parseInt(JSON.parse(level));
    level = mode;
    if (mode == 1) {
        mode = 500;
    } else if (mode == 2) {
        mode = 400;
    } else if (mode == 3) {
        mode = 300;
    }
 }




$(document).ready(function() {
    //kad se zarotirani blokira -> staje
    loadPickedFigures();
    loadMode();
    makeTable();
    startGame();
    
    $("#igraMain").css({
        "background-color" : "#9BB0C1"
    });


    $("div").css({
        "padding-top" : "60px",
        "margin" : "auto",
        "text-align" : "center",
        "font-family" : "Monaco",
        "font-size" : "20px"
    });
    $(".container").css({
        "display": "flex",
        "align-items": "flex-start",
        "justify-content": "space-between"
    });
    

    $(".left").css({
        "flex": "1",
        "margin-right": "10px",
        "margin-left": "30%"
    });
    
    $(".right").css({
        "flex": "1",
        "text-align": "center",
        "margin-left": "10px",
        "margin-right": "30%"
    });

    $("h1").css({                      
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "text-align" : "center",
        "font-size" : "40px"
    });

    $("table").css({                      
        "border-collapse" : "collapse",
        "margin" : "auto"
    });

    $("#game").css({      
        "padding-top" : "20px",                
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "font-size" : "40px",
    });

    $("#prikazFiguraTabela").css({      
        "padding-left" : "20px",                
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "font-size" : "40px"
    });

    $("input").css({      
        "width" : "20px",                
        "height" : "20px"
    });
    $("p").css({      
        "padding-top" : "10px",
        "color" : "red",
        "font-family" : "Monaco",
        "text-align" : "center",
        "font-size" : "40px"
    });
    $("#sledeca").css({      
        "padding-top" : "10px",
        "text-align" : "center",
        "margin" : "auto"
    });

})