//------------------------------------------------------------------|
//---------------------[ Jerarquia de Chomsky ]---------------------|
//------------------------------------------------------------------|

//-- Tipo 0: Contractivas ------------------------------- (SD->a) --|
//-- Tipo 1.1: Sensibles al contexto ------------------- (Sd->db) --|
//-- Tipo 1.2: Dependientes del contexto --------------- (SD->db) --|
//-- Tipo 2: Independientes del contexto - (regulares) -- (S->db) --|
//-- Tipo 3.1: Regular lineal derecha ------------------- (S->aB) --|
//-- Tipo 3.2: Regular lineal izquierda ----------------- (S->Ba) --|




//------------------------------------------------------------------|
//--------------[ Para ver la forma de una sola regla ]-------------|
//------------------------------------------------------------------|

var grammar = {
    "left"  : "Ab",
    "right" : "cb"
}

function analizeR(grammar){

    let left = grammar["left"],
        right = grammar["right"],
        upperR = 0, 
        lowerR = 0,
        upperL = 0,
        lowerL = 0;
   // let ruleT = "";
    
    console.log("Regla a analizar: ", left, " -> ", right);
    
    //Ciclo para analizar cuantas minusculas y mayusculas hay del lado izquierdo
    for(let i of right){
        if(i == i.toUpperCase()){ upperR++; }
        else{ lowerR++; }
    }
    
    //Ciclo para analizar cuantas minusculas y mayusculas hay del lado izquierdo
    for(let i of left){
        if(i == i.toUpperCase()){ upperL++; }
        else{ lowerL++; }
    }
    
    if(left == "Σ"){
        return "SIGMA";
    }
    //Si a la izquierda solo hay un elemento, la busqueda se limita a gramaticas de tipo 2 y 3
    if((left.length == 1) && (right.length > 0)){
    
        //Para verificar si es regular lineal izquierda, derecha o independiente del contexto
        if(((upperR == 1) && (right[right.length-1] == right[right.length-1].toUpperCase())) && (right.length > 1)){ 
            console.log("Es regular lineal derecha."); 
            return "RR";
        }
        else if(((upperR == 1) && (right[0] == right[0].toUpperCase())) && (right.length > 1)){ 
            console.log("Es regular lineal izquierda."); 
            return "RL";
        }
        else { 
            console.log("Es independiente del contexto (regular)"); 
            return "I";
        }
    
    }
    //Si a la izquierda hay mas de un elemento, la busqueda se limita a gramaticas de tipo 1
    else if((left.length > 1) && (right.length > 0)){
    
        //Para verificar si es contractiva, sensitiva o dependiente
        if (left.length > right.length){
            console.log("La regla es contractiva (sin restricciones).");
            return "C";
        }

        else if((upperL == 1) && (lowerL >= upperL)){ 
            console.log("La regla es sensitiva del contexto."); 
            return "S";
        }
        else if(upperL > 1){ 
            console.log("La regla es dependiente del contexto."); 
            return "D"
        }
        else if(upperL == 0){ 
            console.log("Error: No puede haber solo simbolos terminales a la izquierda o cadenas nulas."); 
            return "ERR1";
        }
    }
    else{
        console.log("Error: No puede haber reglas nulas.");
        return "ERR2"
    }
}




//------------------------------------------------------------------|
//--- Para ver la forma de todas las reglas (Tipo de gramatica) ----|
//------------------------------------------------------------------|

function setGrammarType(){
    var type = 4,
        defType = "null",
        lang = getTableContent(),
        nRL = 0, nRR = 0, nD=0,
        grammarTypeBody = document.getElementById("grammarType");

    for (var i = 0 ; i<Object.keys(lang).length; i++){
        var cur = analizeR(lang["g"+(i+1)]);

        if      (cur == "SIGMA")
            continue;
        if      (cur == "RR"){
            cur = 3;
            nRR++;
        }
        else if (cur == "RL"){
            cur = 3;
            nRL++;
        }
        else if (cur == "I") cur = 2;
        else if (cur == "S") cur = 1;
        else if (cur == "D"){
            cur = 1;
            nD++;
        }
        else if (cur == "C") cur = 0;
        else{
            type = 5; 
            break;
        }
        if (type != 5 && (cur < type)) type = cur;
    }
    
    if      (type == 0) defType = "La gramatica es contractiva (sin restricciones).";
    else if (type == 1){
        if (nD>0) defType = "La gramatica es dependiente del contexto.";
        else defType = "La gramatica es sensitiva del contexto.";
    }
    else if (type == 3){
        if      (nRL > 0 && nRR == 0) defType = "La gramatica es regular izquierda."; 
        else if (nRL == 0 && nRR > 0) defType = "La gramatica es regular derecha.";
        else type = 2; 
    }
    if (type == 2) defType = "La gramatica es independiente del contexto.";
    if (type == 5) defType = "Una o mas de las reglas de esta gramtica no coinciden con alguno de los tipos";
    
    grammarTypeBody.innerHTML = defType;
}
