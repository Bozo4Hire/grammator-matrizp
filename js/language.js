var grammarList = {},
    grammarTable = document.getElementById("grammarList").getElementsByTagName("tbody")[0]
    derivationSeqTable = document.getElementById("derivationSeq").getElementsByTagName("tbody")[0],
    optionTable = document.getElementById("optionList").getElementsByTagName("tbody")[0],
    currentString = derivationSeq = "Σ";
    currLang = "";

// Funcion que inserta una gramatica dentro de la tabla 
//      Esta se ejecuta cuando la gramatica del formulario es nueva (selectedRow==null)Σ
function insertNewGrammar(data){
    var newRow = grammarTable.insertRow(grammarTable.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = "";
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.left;
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.right;
}

function updateTableNum(table){
    var rows = table.getElementsByTagName("tr")
    for (var i = 0; i<rows.length; i++){
        rows[i].getElementsByTagName("td")[0].innerHTML = i+1;
    }
}

// Funcion para leer el contenido de un archivo y desplegarlo sobre la tabla 
document.getElementById('inputGrammar').addEventListener('change', function() {
    var fr=new FileReader();

    // Se limpia el contenido de tbody para luego crear el nuevo contenido
    grammarTable.innerHTML="";
    derivationSeq.innerHTML="";
    optionTable.innerHTML = "";
    currentString = derivationSeq = "Σ";

    fr.onload=function(){
        var content=fr.result;
        grammarList = JSON.parse(content);
        console.log(grammarList);
        
        // Por cada indice/elemento en lang, se inserta el sub json por medio de insertNewGrammar()
        for (var i = 0 ; i<Object.keys(grammarList).length; i++){
            var grammar = grammarList["g" + (i+1)];
            insertNewGrammar(grammar);
        }
        updateTableNum(grammarTable);
        if(grammarTable.innerHTML != ""){
            printDerivationSeq();
            setOptions();
        }
    }         
    fr.readAsText(this.files[0]);
})

function setOptions(){
    console.log("Cadena Actual: " + currentString);
    optionTable.innerHTML = "";
    for (var i = 0 ; i<Object.keys(grammarList).length; i++){
 
        if (currentString.search(grammarList["g" + (i+1)].left) != -1){
            insertNewOption(grammarList["g" + (i+1)]);
        }
    }
}

function insertNewOption(data){
    var newRow = optionTable.insertRow(optionTable.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = "";
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.left
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = "→";
    var cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.right;
    var cell5 = newRow.insertCell(4);
        cell5.innerHTML = "<button onClick='onOptionSel(this)' class='btn_select_rule'><i class='fa-solid fa-check'></i></button>";
}

function onOptionSel(element){
    selectedOp = element.parentElement.parentElement;
    currentString = currentString.replace(selectedOp.cells[1].innerHTML, selectedOp.cells[3].innerHTML);

    derivationSeq += ("→" + currentString);
    console.log(currentString + "," + derivationSeq);
    printDerivationSeq(); 
    printCurrentLanguage();

    setOptions();
}

function printDerivationSeq(){
    document.getElementById("derivationSeqBody").innerHTML = derivationSeq;
}

//Funcion para reiniciar la secuencia de derivacion y las opciones disponibles
function resetSettings(){
    currentString = derivationSeq = "Σ";
    setOptions();
}

//Funcion para desplegar el lenguaje generado conforme se avanza en las derivaciones
function printCurrentLanguage(){

    //Obtenemos la ultima cadena de la secuencia
    derivSeqSplit = derivationSeq.split("→");
    var lastString = derivSeqSplit[derivSeqSplit.length-1];

    //Verificamos si es terminal, si es la primer cadena terminal y si ya existe la misma cadena en el lenguaje
    if (lastString == lastString.toLowerCase()){
        if(currLang != ""){
            langSplit = currLang.split(", ");
            for(var i = 0; i < langSplit.length - 1; i++){
                if(lastString == langSplit[i]){
                    resetSettings();
                    return -1; //Si retorna -1, la gramatica tiene una ambiguedad o el usuario utilizo la misma ruta
                }
            }
        }
        //Guardamos la cadena e imprimimos el lenguaje actual
        currLang += lastString + ", ";
        resetSettings();
    }
    document.getElementById("currentLanguageBody").innerHTML = "L(G) = {" + currLang;
}
