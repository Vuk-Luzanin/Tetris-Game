
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

let userFiguresIndexes = [];
let mode;

function showFigures() {
    let n;
    for (let k=0; k<7; k++) {
        let tabela = $("<table></table>");
        if (k == 0) {
            n = 4;
        } else {
            n = 3;
        }
        for (let i=0; i<n; i++) {
            let row = $("<tr></tr>");
            for (let j=0; j<n; j++) {
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
            tabela.append(row).attr("id", "prikazFiguraTabela")
                              .css({"display": "inline-block", "padding-left" : "50px"});
        } 
        $("#prikazFigura").append(tabela);
    }
}

function pickFgures() {
    for (let i=0; i<7; i++) {
        if ($("#a" + i).is(":checked")) {
            userFiguresIndexes.push(i);
        }
    }
    localStorage.setItem("userFiguresIndexes", JSON.stringify(userFiguresIndexes));
}

function getMode() {
    if ($("#lako").is(":checked")) {
        mode = 3;
    } else if ($("#srednje").is(":checked")) {
        mode = 2;
    } else if ($("#tesko").is(":checked")) {
        mode = 1;
    } else {
        mode = 2;
    }
    localStorage.setItem("mode", JSON.stringify(mode));
}



$(document).ready(function() {
    showFigures();


    $("#startGame").click(function() {
        pickFgures();
        getMode();
        window.location.href = "tetris-igra.html";
    });

    $("p").css({
        "text-align" : "left"
    });

    $("ul").css({
        "text-align" : "center",
        "margin" : "auto",
        "display" : "block",
        "list-style-position" : "inside"
    });

    $("#startGame").css({
        "margin" : "auto",
        "text-align" : "center",
        "background-color" : "#F6995C",
        "font-family" : "Monaco",
        "font-size" : "20px",
        "width": "175px",
        "height": "70px"
    });

    $("input").css({      
        "width" : "20px",                
        "height" : "20px"
    });
    

    $("#prikazFiguraTabela").css({      
        "padding-left" : "20px",                
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "font-size" : "40px"
    });

    $("table").css({                      
        "border-collapse" : "collapse",
        "margin" : "auto"
    });

    $("h1").css({                      
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "text-align" : "center",
        "font-size" : "40px"
    });

    $("#prikazFigura").css({
        "padding-top" : "60px",
        "font-family" : "Monaco",
        "font-size" : "20px",
        "text-align" : "center",
        "margin" : "auto"
    });

    $("div").css({
        "padding-top" : "60px",
        "margin" : "auto",
        "text-align" : "center",
        "font-family" : "Monaco",
        "font-size" : "20px"
    });

    
    $("#startPage").css({
        "background-color" : "#9BB0C1"
    });
});

