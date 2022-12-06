var selectedRow = null,
    ndfa = {},
    tableDFA = document.getElementById("dFA_stateList").getElementsByTagName("tbody")[0],
    table = document.getElementById("stateList").getElementsByTagName("tbody")[0],
    zero_input = document.getElementById("left"),
    one_input = document.getElementById("right");
    state_input = document.getElementById("state");

// Funcion/listener para el boton de insercion de la gramatica:
//      En esencia, aqui se determina si la gramatica en cuestion esta 
//      siendo insertada por primera vez o si es una que esta siendo editada
function onFormSubmit(){
    event.preventDefault();
    var newState = recordNewState();
    console.log(newState);
    if(selectedRow == null){
        insertNewState(newState);
    }
    else{
        editState(newState);
    }
    resetForm();
}

// Funcion que se ejecuta al presionar el boton de "Guardar" en el documento html
//      Por medio de la funcion saveAs del fileSaver, se exporta el contenido de la tabla 
//      de gramaticas a un archivo .txt
function onSaveClick(){
        var content = table.getElementsByTagName("tr"),
            initialBool = false, finalBool = false;

        for (var i = 0 ; i<Object.keys(content).length; i++){
            if (content[i].children[3].children[0].checked == true) initialBool = true;
            if (content[i].children[4].children[0].checked == true) finalBool = true;
            if (initialBool == true && finalBool == true) break;
        }
        if (initialBool == true && finalBool == true){
            var blob = new Blob ([JSON.stringify(getTableContent())], {type:"text/plain;charset=utf-8"});
            saveAs(blob, "myFA.txt");
        }
        else{
            alert("Debe haber al menos un estado inicial y un estado final");
        }
}

// Funcion para obtener los valores de la gramatica escritos por el usuario dentro del formulario correspondiente
function recordNewState(){
    var newState = {};
    newState["state"] = state_input.value;
    newState["left"] = zero_input.value;
    newState["right"] = one_input.value;
    newState["initial"] = false;
    newState["final"] = false;
    return newState 
}

// Funcion que inserta una gramatica dentro de la tabla 
//      Esta se ejecuta cuando la gramatica del formulario es nueva (selectedRow==null)
function insertNewState(data){
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = (data.state).toUpperCase();
    var cell2 = newRow.insertCell(1);
        if (data.left == "" || data.left == "λ")
            cell2.innerHTML = "λ";
        else
            cell2.innerHTML = (data.left).toUpperCase();
    var cell3 = newRow.insertCell(2);
        if (data.right == "" || data.right == "λ")
            cell3.innerHTML = "λ";
        else
            cell3.innerHTML = (data.right).toUpperCase();
    var cell4 = newRow.insertCell(3);
        cell4.innerHTML = "<input type='checkbox' onchange=onEditCheckbox(this,3)></input>";
        cell4.children[0].checked = data.initial;
    var cell5 = newRow.insertCell(4);
        cell5.innerHTML = "<input type='checkbox' onchange=onEditCheckbox(this,4)></input>";
        cell5.children[0].checked = data.final;
    var cell6 = newRow.insertCell(5);
        cell6.innerHTML = "<button onClick='onEditState(this)' class='btn_edit_rule'><i class='fa-solid fa-pen'></i></button> <button onClick='onDelete(this)' class='btn_delete_rule'><i class='fa-solid fa-xmark'></i></button>";
}

// Funcion/Listener para el boton de edicion de una gramatica en particular dentro de la tabla
//      La variable selectedRow adopta el valor de la fila/gramatica que se desea editar
function onEditState(element){
    selectedRow = element.parentElement.parentElement;
    state_input.value = selectedRow.cells[0].innerHTML;
    if (selectedRow.cells[1].innerHTML != "λ")
        zero_input.value = selectedRow.cells[1].innerHTML;
    if (selectedRow.cells[2].innerHTML != "λ")
        one_input.value = selectedRow.cells[2].innerHTML;
}

// Funcion/Listener para el boton de borrar de una gramatica determinada
//      Similar a como ocurre en la funcion onEditState(), se selecciona la fila que contiene al botón 
//      y esta es eliminada
function onDelete(element) {
    row = element.parentElement.parentElement;
    document.getElementById("stateList").deleteRow(row.rowIndex);
    resetForm();
}

// Si la funcion onEditState() es ejecutada, se ejecutara la siguiente funcion para modificar los campos
// de la gramatica en cuestion desde el formulario 
function editState(data){
    selectedRow.cells[0].innerHTML = data.state.toUpperCase();
    if (data.left == "")
        selectedRow.cells[1].innerHTML = "λ";
    else 
        selectedRow.cells[1].innerHTML = data.left.toUpperCase();
    if (data.right == "")
        selectedRow.cells[2].innerHTML = "λ";
    else
        selectedRow.cells[2].innerHTML = data.right.toUpperCase();
}


// Por medio de esta funcion se reinician o limpian los valores del formulario y de la variable que
// apunta a la fila en edicion/eliminacion
function resetForm() {
    resetInput();
    selectedRow = null;
}

// Funcion para retornar un array de la gramaticas que se encuentran registradas en la tabla
//      esta funcion es utilizada por onSaveCick para obtener los valores que se van a exportar
function getTableContent(){
    var content = table.getElementsByTagName("tr"),
        automata = new Array();

    for (var i = 0 ; i<content.length; i++){
        var state = {};
        state["state"] = content[i].getElementsByTagName("td")[0].innerHTML;
        state["left"] = content[i].getElementsByTagName("td")[1].innerHTML;
        state["right"] = content[i].getElementsByTagName("td")[2].innerHTML;
        state["initial"] = content[i].getElementsByTagName("td")[3].children[0].checked;
        state["final"] = content[i].getElementsByTagName("td")[4].children[0].checked;
        automata[i] = state;
    }
    return automata
}

//function updateTableNum(){
//    var rows = table.getElementsByTagName("tr")
//    for (var i = 0; i<rows.length; i++){
//        rows[i].getElementsByTagName("td")[0].innerHTML = i+1;
//    }
//}

// Funcion para leer el contenido de un archivo y desplegarlo sobre la tabla 
document.getElementById('inputState').addEventListener('change', function() {
    var fr=new FileReader();

    // Se limpia el contenido de tbody para luego crear el nuevo contenido
    table.innerHTML="";

    fr.onload=function(){
        var content=fr.result;
        ndfa = JSON.parse(content);
        console.log(ndfa);
        
        // Por cada indice/elemento en ndfa, se inserta el sub json por medio de insertNewState()
        for (var i = 0 ; i<Object.keys(ndfa).length; i++){
            var state = ndfa[i];
            insertNewState(state);
        }
        //updateTableNum();
    }         
    fr.readAsText(this.files[0]);
})

function resetInput(){
    state_input.value = "";
    zero_input.value = "";
    one_input.value = "";
    state_input.disabled = false;
    zero_input.disabled = false;
    one_input.disabled = false;
}

function onEditCheckbox(element, col){
    selectedRow0 = element.parentElement.parentElement;
    var content = table.getElementsByTagName("tr");
    if(element.checked == true){
        for (var i = 0 ; i<Object.keys(content).length; i++){
            if (selectedRow0 != content[i])
                content[i].children[col].children[0].checked = false;
        }
    }
}



function convertToDFA(){
    var finalState;
    tableDFA.innerHTML = "";
    const arrayA1 = new Array();
    var content = table.getElementsByTagName("tr");
    console.log(content[0]);
    for (var i = 0 ; i<content.length; i++){
        const state = [];
        state[0] = content[i].getElementsByTagName("td")[0].innerHTML.split("");
        state[1] = content[i].getElementsByTagName("td")[1].innerHTML.split("");
        state[2] = content[i].getElementsByTagName("td")[2].innerHTML.split("");
        state[3] = content[i].getElementsByTagName("td")[3].children[0].checked;
        state[4] = content[i].getElementsByTagName("td")[4].children[0].checked;
        arrayA1.push(state);
    }
    console.log(arrayA1);

    if(arrayA1[0] != undefined){
        for(var i = 0 ; i<arrayA1.length; i++){
            if (arrayA1[i][3] == true){
                var aux = arrayA1[0];
                arrayA1[0] = arrayA1[i];
                arrayA1[i] = aux;
            }
            if (arrayA1[i][4] == true){
                finalState = arrayA1[i][0];
                var aux = arrayA1[arrayA1.length-1];
                arrayA1[arrayA1.length-1] = arrayA1[i];
                arrayA1[i] = aux;
            }
        }

        insertNewFDAState(arrayA1[0][0].join(''), arrayA1[0][1].join(''), arrayA1[0][2].join(''), arrayA1[0][3], arrayA1[0][4]);
        //tableDFA.getElementsByTagName("tr")[1].getElementsByTagName("td")[0].innerHTML += "A";


        var c = 1;
  
        if (arrayA1[0][1].join('') !== "λ" && arrayA1[0][1].join('') !== arrayA1[0][0].join('')){
            insertNewFDAState(arrayA1[0][1].join(''), "", "", false, false);
            c++;
        }

        if (arrayA1[0][2].join('') !== "λ" && arrayA1[0][2].join('') !== arrayA1[0][0].join('')){
            insertNewFDAState(arrayA1[0][2].join(''), "", "", false, false);
            c++;
        }
        var i = 1;
    
        while(i < c){
            rows = tableDFA.getElementsByTagName("tr");
            var arState = Array.from(rows[i].getElementsByTagName("td")[0].innerHTML);
            var arLeft = [];
            var arRight = [];
          
            for(var j = 0; j<arState.length; j++){
                for(var k = 0; k < arrayA1.length; k++){
                    
                    if(arrayA1[k][0].join('') == arState[j]){
                        if(arrayA1[k][1].join('') != "λ"){

                            for(var m = 0; m < arrayA1[k][1].length; m++){
                                arLeft.push(arrayA1[k][1][m]);
                            }

                        }
                        if(arrayA1[k][2].join('') != "λ"){

                            for(var m = 0; m < arrayA1[k][2].length; m++){
                                arRight.push(arrayA1[k][2][m]);
                            }

                        }
                    }
                }
            }
            console.log(arLeft);
            console.log(arRight)
            if (!arLeft.length) arLeft.push("λ");
            if (!arRight.length) arRight.push("λ");
            rows[i].getElementsByTagName("td")[1].innerHTML = [...new Set(arLeft)].join('')
            rows[i].getElementsByTagName("td")[2].innerHTML = [...new Set(arRight)].join('')

            var conditionL = true, conditionR = true;
            for(var j = 0; j<rows.length; j++){
                if(rows[j].getElementsByTagName("td")[0].innerHTML == rows[i].getElementsByTagName("td")[1].innerHTML
                || rows[i].getElementsByTagName("td")[1].innerHTML == "λ")
                    conditionL = false;
                if(rows[j].getElementsByTagName("td")[0].innerHTML == rows[i].getElementsByTagName("td")[2].innerHTML
                || rows[i].getElementsByTagName("td")[1].innerHTML == "λ")
                    conditionR = false;
            }

            if (conditionL == true){
                insertNewFDAState(rows[i].getElementsByTagName("td")[1].innerHTML, "", "", false, false);
                c++;
            } 
            if (conditionR == true){
                insertNewFDAState(rows[i].getElementsByTagName("td")[2].innerHTML, "", "", false, false);
                c++;
            } 


            i++;
        }
    }
    
}
// push(arrayAD[0][1], "Z")

const push = (array, value) => [...array, value];

function insertNewFDAState(state, left, right, initial, final){
    var newDFARow = tableDFA.insertRow(tableDFA.length);

    var cell1 = newDFARow.insertCell(0);
        cell1.innerHTML = state;
    var cell2 = newDFARow.insertCell(1);
        cell2.innerHTML = left;
    var cell3 = newDFARow.insertCell(2);
        cell3.innerHTML = right;
    var cell4 = newDFARow.insertCell(3);
        cell4.innerHTML = "<input type='checkbox' disabled='true'></input>";
        cell4.children[0].checked =initial;
    var cell5 = newDFARow.insertCell(4);
        cell5.innerHTML = "<input type='checkbox' disabled='true'></input>";
        cell5.children[0].checked = final;
}


function convertToGram(){
    var content = table.getElementsByTagName("tr"); // faltaba definir esta madre, hay que hacerlo cada vez que se corre esta función
    const accArray = []; // también este areglo que va a guardar los estados de la máquina de la izquierda
    const left = [];
    const right = [];
    var grammarLength = 0;

    for(var i = 0; i < content.length; i++){
        const state = [];
        state[0] = content[i].getElementsByTagName("td")[0].innerHTML.split("");
        state[1] = content[i].getElementsByTagName("td")[1].innerHTML.split("");
        state[2] = content[i].getElementsByTagName("td")[2].innerHTML.split("");
        state[3] = content[i].getElementsByTagName("td")[3].children[0].checked;
        state[4] = content[i].getElementsByTagName("td")[4].children[0].checked;
        accArray.push(state);
    }

    //-------------[Paso 1: Verificamos que lambda pertenezca a la gramatica]----------------//
    const initials = [];
    const finals = [];

    for(var i = 0; i < content.length; i++){
        if(accArray[i][3] == true){
            initials.push(accArray[i][0]);
        }
        if(accArray[i][4] == true){
            finals.push(accArray[i][0]);
        }
    }

    if(JSON.stringify(initials) == JSON.stringify(finals)){ 
        left.push("Σ");
        right.push("λ");
        //console.log("Sigma -> Lambda");
        grammarLength += 1; 
    }
    else{ 
        console.log("Lambda no pertenece al lenguaje.")
    }

    //--------------[Paso 2: Añadimos las reglas de Sigma -> estado inicial]------------------//
    for(var i = 0; i < initials.length; i++){
        left.push("Σ");
        right.push(initials[i]);
        //console.log("Sigma -> ", initials[i]);
        grammarLength += 1;
    }

    //--------------[Paso 3 y 4: Buscamos las transiciones que llevan a estados terminales y transiciones restantes]------------------//
    for(var i = 0; i < content.length; i++){
        var stateWith0 = JSON.stringify(accArray[i][1]);
        var stateWith1 = JSON.stringify(accArray[i][2]);
        for(var j = 0; j < finals.length; j++){
            var stateFinal = JSON.stringify(finals[j]);
            if(stateWith0 == stateFinal){
                left.push(accArray[i][0]);
                right.push("0");
                //console.log(accArray[i][0], " -> 0");
                grammarLength += 1;
            }
            if(stateWith1 == stateFinal){
                left.push(accArray[i][0]);
                right.push("1");
                //console.log(accArray[i][0], " -> 1");
                grammarLength += 1;
            }
            if(stateWith0 != stateFinal){
                left.push(accArray[i][0]);
                var temp1 = "0" + accArray[i][1];
                right.push(temp1);
                //console.log(accArray[i][0], " -> 0", accArray[i][1]);
                grammarLength += 1;
            }
            if(stateWith1 != stateFinal){
                left.push(accArray[i][0]);
                var temp2 = "1" + accArray[i][2];
                right.push(temp2);
                //console.log(accArray[i][0], " -> 1", accArray[i][2]);
                grammarLength += 1;
            }
        }
    }
    console.log(grammarLength);

    //--------------[Imprimimos la gramatica en la tabla]---------------//
        //--------------[Imprimimos la gramatica en la tabla]---------------//
   /* for(var i = 0; i < content.length; i++){

    }*/
    for(var i = 0; i < grammarLength; i++){
        var newGramRow = tableDFA.insertRow(tableDFA.length);
        var cell1 = newGramRow.insertCell(0);
            cell1.innerHTML = i + 1;
        var cell2 = newGramRow.insertCell(1);
            cell2.innerHTML = left[i];
        var cell3 = newGramRow.insertCell(2);
            cell3.innerHTML = right[i];
    }
}
