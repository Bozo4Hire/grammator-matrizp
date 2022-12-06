var selectedRow = null,
    lang = {},
    table = document.getElementById("grammarList").getElementsByTagName("tbody")[0],
    tableState = document.getElementById("stateList").getElementsByTagName("tbody")[0],
    left_input = document.getElementById("left"),
    right_input = document.getElementById("right");

var auxiliar = 0;

// Funcion/listener para el boton de insercion de la gramatica:
//      En esencia, aqui se determina si la gramatica en cuestion esta 
//      siendo insertada por primera vez o si es una que esta siendo editada
function onFormSubmit(){
    event.preventDefault();
    var newGrammar = recordNewGrammar();
    console.log(newGrammar);
    if(selectedRow == null){
        insertNewGrammar(newGrammar);
    }
    else{
        editGrammar(newGrammar);
    }
    resetForm();
}

// Funcion que se ejecuta al presionar el boton de "Guardar" en el documento html
//      Por medio de la funcion saveAs del fileSaver, se exporta el contenido de la tabla 
//      de gramaticas a un archivo .txt
function onSaveClick(){
        var blob = new Blob ([JSON.stringify(getTableContent())], {type:"text/plain;charset=utf-8"});
        saveAs(blob, "myGrammar.txt");
}

// Funcion para obtener los valores de la gramatica escritos por el usuario dentro del formulario correspondiente
function recordNewGrammar(){
    var newGrammar = {};
    newGrammar["left"] = left_input.value;
    newGrammar["right"] = right_input.value;
    return newGrammar 
}

// Funcion que inserta una gramatica dentro de la tabla 
//      Esta se ejecuta cuando la gramatica del formulario es nueva (selectedRow==null)
function insertNewGrammar(data){
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = "";
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.left;
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.right;
}

// Funcion/Listener para el boton de edicion de una gramatica en particular dentro de la tabla
//      La variable selectedRow adopta el valor de la fila/gramatica que se desea editar
function onEditGrammar(element){
    selectedRow = element.parentElement.parentElement;
    left_input.value = selectedRow.cells[1].innerHTML;
    right_input.value = selectedRow.cells[2].innerHTML;
}

// Funcion/Listener para el boton de borrar de una gramatica determinada
//      Similar a como ocurre en la funcion onEditGrammar(), se selecciona la fila que contiene al botón 
//      y esta es eliminada
function onDelete(element) {
    row = element.parentElement.parentElement;
    document.getElementById("grammarList").deleteRow(row.rowIndex);
    resetForm();
}

// Si la funcion onEditGrammar() es ejecutada, se ejecutara la siguiente funcion para modificar los campos
// de la gramatica en cuestion desde el formulario 
function editGrammar(data){
    //console.log(data);
    selectedRow.cells[1].innerHTML = data.left;
    selectedRow.cells[2].innerHTML = data.right;
}


// Por medio de esta funcion se reinician o limpian los valores del formulario y de la variable que
// apunta a la fila en edicion/eliminacion
function resetForm() {
    resetInput();
    selectedRow = null;
    updateTableNum();
    
}

// Funcion para retornar un array de la gramaticas que se encuentran registradas en la tabla
//      esta funcion es utilizada por onSaveCick para obtener los valores que se van a exportar
function getTableContent(){
    var content = table.getElementsByTagName("tr"),
        language = {};

    for (var i = 0 ; i<content.length; i++){
        var grammar = {};
        grammar["left"] = content[i].getElementsByTagName("td")[1].innerHTML;
        grammar["right"] = content[i].getElementsByTagName("td")[2].innerHTML;

        language["g" + (i+1)] = grammar;
    }
    return language
}

function updateTableNum(){
    var rows = table.getElementsByTagName("tr")
    for (var i = 0; i<rows.length; i++){
        rows[i].getElementsByTagName("td")[0].innerHTML = i+1;
    }
}

// Funcion para leer el contenido de un archivo y desplegarlo sobre la tabla 
document.getElementById('inputGrammar').addEventListener('change', function() {
    var fr=new FileReader();

    // Se limpia el contenido de tbody para luego crear el nuevo contenido
    table.innerHTML="";

    fr.onload=function(){
        var content=fr.result;
        lang = JSON.parse(content);
        console.log(lang);
        
        // Por cada indice/elemento en lang, se inserta el sub json por medio de insertNewGrammar()
        for (var i = 0 ; i<Object.keys(lang).length; i++){
            var grammar = lang["g" + (i+1)];
            insertNewGrammar(grammar);
        }
        updateTableNum();
    }         
    fr.readAsText(this.files[0]);
})

function onSigmaClick(){
    left_input.value = "Σ";
    left_input.disabled = true;
}

function onLambdaClick(){
    left_input.value = "Σ";
    right_input.value = "λ";
    left_input.disabled = true;
    right_input.disabled = true;
}

function resetInput(){
    left_input.value = "";
    right_input.value = "";
    left_input.disabled = false;
    right_input.disabled = false;
}

function convertToAutom(){
    tableState.innerHTML="";
    var content = table.getElementsByTagName("tr");
    const ruleArray = [];
    const state = [];
    const left = [];
    const right = [];
    const initials = [];
    var stateCount = 0;

    for(var i = 0; i < content.length; i++){
        const rule = [];
        rule[0] = content[i].getElementsByTagName("td")[1].innerHTML.split("");
        rule[1] = content[i].getElementsByTagName("td")[2].innerHTML.split("");
        ruleArray.push(rule);
    }

    //--------------[Paso 1: Saber si lambda esta en el lenguaje]--------------//
    for(var i = 0; i < content.length; i++){
        if(ruleArray[i][0] == "Σ" && ruleArray[i][1] == "λ"){
            stateCount += 1;
            console.log("1) I n F es diferente de vacio. qF esta en I.");
            //Imprime Sigma = Lambda
            initials.push("Qf");

        }
    }

    //--------------[Paso 2: Buscar los estados iniciales]--------------//
    for(var i = 0; i < content.length; i++){
        if(ruleArray[i][0] == "Σ" && ruleArray[i][1].length == 1 && ruleArray[i][1] != "λ"){
            stateCount += 1;
            initials.push(ruleArray[i][1]);
        }
    }
    console.log("2) Los iniciales son: ", initials);

    //--------------[Paso 3: Buscar las transiciones a estados finales]--------------//
    console.log("3) Buscamos las transiciones al estado de aceptacion:");
    for(var i = 0; i < content.length; i++){
        if(ruleArray[i][1].length == 1){
            var leftState="", rightState="";
            if(ruleArray[i][1] == "0"){
                //Imprime Estado va a qF con 0
                console.log("Estado: ", ruleArray[i][0], "Con 0 va a: qF");
                stateCount += 1;
                leftState = ruleArray[i][0];
                insertNewAcceptorState(ruleArray[i][0], "Qf", "");
            }
            if(ruleArray[i][1] == "1"){
                //Imprime Estado va a qF con 1
                console.log("Estado: ", ruleArray[i][0], "Con 1 va a: qF");
                stateCount += 1;
                rightState = ruleArray[i][0];
                insertNewAcceptorState(ruleArray[i][0], "", "Qf")
            }
            state.push(ruleArray[i][0]);
            left.push(leftState);
            right.push(rightState);
        }
    }
    //--------------[Paso 4: Buscar las transiciones restantes]--------------//
    console.log("4) Buscamos las transiciones restantes:");
    for(var i = 0; i < content.length; i++){
        for(var j = 0; j < ruleArray[i][1].length; j++){
            if((JSON.stringify(ruleArray[i][1][j]) != isNum(JSON.stringify(ruleArray[i][1][j]))) && (ruleArray[i][1][j] != ruleArray[i][1][j].toLowerCase()) && (ruleArray[i][0] != "Σ")){
                //Imprime Estado va a Estado con 0 o 1
                console.log("El estado ", ruleArray[i][0], " va al estado ", ruleArray[i][1][j], " con ", ruleArray[i][1][0]);
                
                if(ruleArray[i][1][0]=="0"){
                    insertNewAcceptorState(ruleArray[i][0], ruleArray[i][1][j], "")
                }
                else insertNewAcceptorState(ruleArray[i][0], "", ruleArray[i][1][j])
            }
        }
    }

    insertNewAcceptorState("Qf", "", "");
  
    for(var i = 0; i < tableState.children.length; i++){
        if(tableState.children[i].children[0].innerHTML == "Qf")
            tableState.children[i].children[4].children[0].checked = 1;
        
            for(var j = 0 ; j < initials.length ; j++){
            
            if(initials[j] == tableState.children[i].children[0].innerHTML)
                tableState.children[i].children[3].children[0].checked = 1;
        }
    }
}

//Funcion para saber si hay numeros en una cadena.
function isNum(v) {
    return /\d/.test(v);
}

function insertNewAcceptorState(state, left, right){
    var stateExists = 0;
    var i = 0;
    for(i ; i < tableState.children.length ; i++){
        if(tableState.children[i].children[0].innerHTML == state){
            stateExists = 1;
            break;
        }
    }

    if(stateExists==0){
        var newStateRow = tableState.insertRow(tableState.length);

        var cell1 = newStateRow.insertCell(0);
            cell1.innerHTML = state;
        var cell2 = newStateRow.insertCell(1);
            cell2.innerHTML = left;
        var cell3 = newStateRow.insertCell(2);
            cell3.innerHTML = right;
        var cell4 = newStateRow.insertCell(3);
            cell4.innerHTML = "<input type='checkbox' disabled='true'></input>";
        var cell5 = newStateRow.insertCell(4);
            cell5.innerHTML = "<input type='checkbox' disabled='true'></input>";
    }
    else{
        tableState.children[i].children[1].innerHTML += left;
        tableState.children[i].children[2].innerHTML += right;
    }
}