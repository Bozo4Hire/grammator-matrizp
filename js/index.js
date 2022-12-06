var selectedRow = null,
    lang = {},
    table = document.getElementById("grammarList").getElementsByTagName("tbody")[0],
    left_input = document.getElementById("left"),
    right_input = document.getElementById("right");

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
    var cell4 = newRow.insertCell(3);
        cell4.innerHTML = "<button onClick='onEditGrammar(this)' class='btn_edit_rule'><i class='fa-solid fa-pen'></i></button> <button onClick='onDelete(this)' class='btn_delete_rule'><i class='fa-solid fa-xmark'></i></button>";
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
