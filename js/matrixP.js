/*
Valores de precedencia codificados
0 = n/a
1 = ⋖
2 = ⪂
3 = ≐

Delimitadores codificados (Se codifican de 0 a 7 para poder hacer comparaciones en la matriz)
0 = )
1 = ^
2 = /
3 = *
4 = +
5 = -
6 = (
7 = #

Ejemplo: matrizPrecedencia[0][6] devuelve la precedencia que hay entre el delimitador ) y el delimitador ( la cual es 2 y corresponde a ⪂
*/

//Variables auxiliares para el algoritmo mediante la matriz de precedencia
var sigma = [];
var phi = [];
let tao = [];
var alpha = [];
var ro = [];
var n = [];
var n1 = [];
var n2 = [];
const delim = [")", "^", "/", "*", "+", "-", "(", "#"];
const operador = ["+", "-", "*", "/", "^"];

//Matriz de precedencia utilizada
const matrizPrecedencia = [
/*            (     ^     /     *     +     -     )     #     */    
/*   )   */[ '0' , '2' , '2' , '2' , '2' , '2' , '2' , '2' ],
/*   ^   */[ '1' , '2' , '2' , '2' , '2' , '2' , '2' , '2' ],
/*   /   */[ '1' , '1' , '2' , '2' , '2' , '2' , '2' , '2' ],
/*   *   */[ '1' , '1' , '2' , '2' , '2' , '2' , '2' , '2' ],
/*   +   */[ '1' , '1' , '1' , '1' , '2' , '2' , '2' , '2' ],
/*   -   */[ '1' , '1' , '1' , '1' , '2' , '2' , '2' , '2' ],
/*   (   */[ '1' , '1' , '1' , '1' , '1' , '1' , '3' , '0' ],
/*   #   */[ '1' , '1' , '1' , '1' , '1' , '1' , '0' , '3' ]
];

//Obtenemos expresion a evaluar
//var expresion = "2*(1+1)^(4-2)";
//var expresion = "2*(";
//var expresion = "(100-20)*((+1)";
//var expresion = "2*(1+11)^(4-2)";
var table = document.getElementById("evaluationList").getElementsByTagName("tbody")[0];
var leftV = document.getElementById("expresion");
var result = document.getElementById("result");
var message = document.getElementById("errorMsg");

//Funcion para insertar iteraciones del algoritmo en la tabla, con sus respectivos valores
function insertNewIteration(n, sigma, phi, tao, alpha, ro, n1, n2, n3){
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = n;
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = sigma;
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = phi;
    var cell3 = newRow.insertCell(3);
        cell3.innerHTML = tao;
    var cell3 = newRow.insertCell(4);
        cell3.innerHTML = alpha;
    var cell3 = newRow.insertCell(5);
        cell3.innerHTML = ro;
    var cell3 = newRow.insertCell(6);
        cell3.innerHTML = n1;
    var cell3 = newRow.insertCell(7);
        cell3.innerHTML = n2;
    var cell3 = newRow.insertCell(8);
        cell3.innerHTML = n3;
}

//Funcion para reiniciar los valores de la tabla y el algoritmo
function resetValues(){
    sigma = [];
    phi = [];
    tao = [];
    alpha = [];
    ro = [];
    n = [];
    n1 = [];
    n2 = [];
    message.innerHTML = "";
    result.innerHTML = "";
    var table = document.getElementById("evaluationList").getElementsByTagName("tbody")[0];
    table.innerHTML = "";
}

//Funcion para comparar la precedencia de dos delimitadores con respecto a la matriz
function comparadorPrecedencia(d1, d2){
    //Variables auxiliares
    var x1 = "";
    var x2 = "";

    //Codificar el primer delimitador
    if(d1 == delim[0]){ x1 = "0"; }
    if(d1 == delim[1]){ x1 = "1"; }
    if(d1 == delim[2]){ x1 = "2"; }
    if(d1 == delim[3]){ x1 = "3"; }
    if(d1 == delim[4]){ x1 = "4"; }
    if(d1 == delim[5]){ x1 = "5"; }
    if(d1 == delim[6]){ x1 = "6"; }
    if(d1 == delim[7]){ x1 = "7"; }

    //Codificar el segundo delimitador
    if(d2 == delim[0]){ x2 = "6"; }
    if(d2 == delim[1]){ x2 = "1"; }
    if(d2 == delim[2]){ x2 = "2"; }
    if(d2 == delim[3]){ x2 = "3"; }
    if(d2 == delim[4]){ x2 = "4"; }
    if(d2 == delim[5]){ x2 = "5"; }
    if(d2 == delim[6]){ x2 = "0"; }
    if(d2 == delim[7]){ x2 = "7"; }

    //Determinar la precedencia de los dos delimitadores
    switch(matrizPrecedencia[x1][x2]){
        case "0": 
            //console.log("No aplica."); 
            return 0; break;
        case "1": 
            //console.log(d1, " es de menor precedencia que ", d2); 
            return 1; break;
        case "2": 
            //console.log(d1, " es de mayor o igual precedencia que ", d2); 
            return 2; break;
        case "3": 
            //console.log(d1, " es de igual precedencia que ", d2); 
            return 3; break;
    }
}

//Funcion para obtener el cabezal de una expresion
function cabezal(expresion){
    return expresion[0];
}

//Funcion para obtener la cola de una expresion
function cola(expresion){
    return expresion.slice(1,expresion.length);
}

//Funcion para obtener el tope de una expresion
function tope(expresion){
    return expresion[expresion.length-1];
}

//Funcion para obtener todos los elementos de una expresion exepto el ultimo
function resto(expresion){
    expresion.pop();
    return expresion;
}

//Funcion para saber si un caracter es un numero en una cadena
function isNum(val){
    for(var i = 0; i < delim.length; i++){
        if(val == delim[i]){
            return false;
        }
    }
    return !isNaN(val)
}

//Funcion para convertir los elementos de la cadena a una pila
function convertToStack(expresion){
    for(var i = 0; i < expresion.length; i++){
        if(isNum(expresion[i]) == true){
            var auxNum = "";
            var bandera = true;
            var auxCont = 0;
            auxNum = expresion[i];
            for(var j = i+1; j < expresion.length; j++){
                if((isNum(expresion[j]) == true) && (bandera == true)){
                    auxNum += expresion[j];
                    auxCont++;
                }
                if(isNum(expresion[j]) == false){
                    bandera = false;
                }
            }
            phi.push(parseFloat(auxNum));
            i += auxCont;
        }
        else{
            phi.push(expresion[i]);
        }
    }
}

//Funcion para evaluar la expresion aritmetica de entrada
function evaluateExpression(){
    //---------------[Paso 1]-----------------//
    //Inicializamos las variables para el algoritmo

    //Convertimos la cadena inicial a una pila
    resetValues();
    var expresion = leftV.value;
    console.log(typeof expresion);
    convertToStack(expresion);

    //Inicializamos las variables iniciales
    sigma.push('#');
    phi.push('#');
    var contadorIteracion = 1;

    //Imprimimos la iteracion inicial
    console.log("σ   Ψ   τ   α   ρ   n1   n2   n3'");
    console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
    insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);

    //Ciclo para comenzar las iteraciones
    while((sigma + phi != "##")){
        alpha = [];
        //---------------[Paso 2]-----------------//
        //Analizamos si el cabezal de phi es un numeral o un delimitador

        //Si es un numeral
        if(isNum(cabezal(phi)) == true){
            tao.push(cabezal(phi));
            phi = cola(phi);

            //Imprimimos la iteracion resultante
            contadorIteracion++;
            console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
            insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);
        }

        //Si es un delimitador
        if(isNum(cabezal(phi)) == false){

            //---------------[Paso 3]-----------------//
            //Analizamos la precedencia del tope de sigma con respecto al cabezal de phi

            //Si la precedencia es menor o igual
            if(comparadorPrecedencia(tope(sigma),cabezal(phi)) == 1 || comparadorPrecedencia(tope(sigma),cabezal(phi)) == 3){
                sigma.push(cabezal(phi));
                phi = cola(phi);

                //Imprimimos la iteracion resultante
                contadorIteracion++;
                console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
                insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);
            }

            //Si la precedencia es mayor
            else if(comparadorPrecedencia(tope(sigma),cabezal(phi)) == 2){
                alpha.unshift(tope(sigma));
                sigma = resto(sigma);
                
                //Imprimimos la iteracion resultante
                contadorIteracion++;
                console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
                insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);

                //Si la precedencia es igual
                if(comparadorPrecedencia(tope(sigma),cabezal(alpha))==3){
                    alpha.unshift(tope(sigma));
                    sigma = resto(sigma);

                    //Imprimimos la iteracion resultante
                    contadorIteracion++;
                    console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
                    insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);
                }

                //---------------[Paso 4]-----------------//
                //Hacemos la operacion correspondiente o terminamos el algoritmo

                //Si la precedencia es menor
                if(comparadorPrecedencia(tope(sigma),cabezal(alpha)) == 1){

                    //Verificar si alpha es un operador
                    if(alpha[0] == '+' || alpha[0] == '-' || alpha[0] == '*' || alpha[0] == '/' ||alpha[0] == '^'){

                        //Revisar que la magnitud de tao sea mayor de 2
                        if(tao.length >= 2){

                            //---------------[Paso 5]-----------------//
                            //Realizamos la operacion correspondiente

                            //Obtener valores de ro, n y n1 y n2
                            ro = tao.slice(0,tao.length-2);
                            n = tao[tao.length-2];
                            n = parseFloat(n);
                            n1 = tao[tao.length-1];
                            n1 = parseFloat(n1);

                            //Comparamos y hacemos la operacion correspondiente
                            if(alpha[0] == "+"){ n2 = n + n1; }
                            if(alpha[0] == "-"){ n2 = n - n1; }
                            if(alpha[0] == "*"){ n2 = n * n1; }
                            if(alpha[0] == "/"){ n2 = n / n1; }
                            if(alpha[0] == "^"){ n2 = Math.pow(n, n1); }

                            //Adjuntamos el resultado en tao
                            tao.pop();
                            tao.pop();
                            tao.push(n2);

                            //Imprimimos la iteracion resultante
                            console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
                            insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);
                            
                            //Preestablecer los valores
                            alpha = [];
                            n = [];
                            n1 = [];
                            n2 = [];
                            ro = [];
                            
                            //Imprimimos la ultima iteracion
                            console.log(contadorIteracion, sigma.join('') + "   " + phi.join('') + "   " + tao , "   " + alpha.join('') + "   " + ro.join('') + "   " + n + "   " + n1 + "   " + n2);
                            insertNewIteration(contadorIteracion, sigma, phi, tao, alpha, ro, n, n1, n2);
                            
                            //---------------[Paso 6]-----------------//
                            //Verificamos si el algoritmo termino despues de haber hecho una operacion

                            //Si sigma concatenado con alpha es igual a "##"
                            if((sigma[0]== "#" && sigma.length == 1) && phi[0] == "#" ){
                                if(tao.length <= 1){
                                    console.log("La expresion evaluada es igual a: ", tao[0]);
                                    result.innerHTML = tao[0];
                                    message.innerHTML = "Mensaje: La evaluacion ha sido exitosa.";
                                    return 0;
                                }
                                else{
                                    console.log("Error: tao no tiene la cardinalidad adecuada.");
                                    message.innerHTML = "Error: tao no tiene la cardinalidad adecuada.";
                                    return 1;
                                }
                            }
                        }else{
                            console.log("Error: Hubo un problema con la operacion.");
                            message.innerHTML = "Error: Hubo un problema con la operacion.";
                            return 1;
                        }                        
                    }
                }
                //---------------[Paso 7]-----------------//
                //Verificamos si el algoritmo termino despues de haber encontrado dos parentesis en aplha

                //Si hay 2 parentesis que abren y cierran en alpha
                if((alpha[alpha.length - 1] == ")") && (alpha[alpha.length - 2] == "(")){
                    if(sigma + phi == "##"){
                        if(tao.length == 1){
                            console.log("La expresion evaluada es igual a: ", tao[0]);
                            result.innerHTML = tao[0];
                            message.innerHTML = "Mensaje: La evaluacion ha sido exitosa.";
                            return 0;
                        }
                        else{
                            console.log("Error: tao no tiene cardinalidad 1.");
                            message.innerHTML = "Error: tao no tiene cardinalidad 1.";
                            return 1;
                        }
                    }
                }
            }
            
            //Este error sucede cuando hay parentesis de mas (la precedencia es n/a)
            else{
                console.log("Error: La expresion no esta balanceada.");
                message.innerHTML = "Error: La expresion no esta balanceada.";
                return 1;
            }
        }
    }
}