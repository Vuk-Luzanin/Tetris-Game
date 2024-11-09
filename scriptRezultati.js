const DEF_BACK_COLOR = "#ffe9d0";


let rezultati = [];
let playerName;
let score;
rezultati[0] = (["Ime" , "Poeni"]);

function promptForName() {
    let playerName = prompt("Unesite svoje ime:");
    if (!playerName || playerName.trim() === "") {
        alert("Morate uneti ime!");
        return promptForName();
    } else if (playerName.length > 20) {
        alert("Ime ne sme biti duže od 20 karaktera!");
        return promptForName(); // Ponovo pozivamo funkciju za unos
    } else {
        return playerName; // Ako je sve u redu, vraćamo uneto ime
    }
}

function setResultTable() {

    score = localStorage.getItem("scoredRows");      
    score = JSON.parse(score); 
    rezultati = localStorage.getItem("rezultati");
    rezultati = JSON.parse(rezultati);
    if (rezultati == null) {
        rezultati = [];
        rezultati[0] = (["Ime" , "Poeni"]);
        
    }    
    //rezultati.push([playerName , score]);
    if (rezultati.length >= 2) {
        rezultati.sort(function(a, b) {
            return b[1] - a[1];
        });
        rezultati = rezultati.slice(0, 6);
    } 
    rezultati.push([playerName , score]);
    

    for (let i=0; i<rezultati.length; i++) {
        let row = $("<tr></tr>");
        
        let cell1 = $("<td> " + rezultati[i][0] + "</td>").css({                      
            "width" : "40%",        
            "height" : "40px",
            "background-color" : DEF_BACK_COLOR,
            "margin" : "auto",
        });
        row.append(cell1);
        let cell2 = $("<td> " + rezultati[i][1] + "</td>").css({                      
            "width" : "40%",        
            "height" : "40px",
            "background-color" : DEF_BACK_COLOR,
            "margin" : "auto",
        });
        row.append(cell2);
        $("#tabelaRezultata").append(row);
    }
    localStorage.setItem("rezultati", JSON.stringify(rezultati));
}




$(document).ready(function() {
    playerName = promptForName();
    setResultTable();
    




    $("#backToUputstvo").click(function() {
        window.location.href = "tetris-uputstvo.html";
    });
    $("#tabelaContainer").css({
        "margin": "auto",
        "width": "fit-content"
    });

    $("#backToUputstvo").css({
        "margin" : "auto",
        "text-align" : "center",
        "background-color" : "#F6995C",
        "font-family" : "Monaco",
        "font-size" : "20px",
        "width": "175px",
        "height": "140px"
    });

    $("div").css({
        "padding-top" : "60px",
        "margin" : "auto",
        "text-align" : "center",
        "font-family" : "Monaco",
        "font-size" : "20px"
    });

    $("h1").css({                      
        "color" : "#EADFB4",
        "font-family" : "Monaco",
        "margin" : "auto",
        "font-size" : "40px"
    });

    $("table").css({                      
        "margin" : "auto"
    });

    $("input").css({      
        "width" : "20px",                
        "height" : "20px"
    });

    $("#igraRezultati").css({      
        "margin" : "auto",
        "text-align" : "center",
        "background-color" : "#9BB0C1",
        "font-family" : "Monaco",
        "font-size" : "20px"
    });
});
