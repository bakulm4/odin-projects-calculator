
const display = document.querySelector('.output');
let formula = '0';
let output = '0';
let prevValue = 0;
let calculated = false;

function isOperator(str){
    return /^[-+/x]$/.test(str);
}

function handleNumber(str){

    //if I am starting out fresh or equals was clicked before this
    if((formula === '0' && output === '0')|| calculated){
        formula = output = '';
        if(calculated)// if equals sign was clicked, before this start a new expression
            calculated = false;
    }

    //If an operator was clicked before this
    else if(isOperator(formula[formula.length-1])){
        output = '';
    }
    //If a number was clicked before this and if we have entered 0s so far
    else if(output==='0'){
        output = '';
        //remove the previous 0 added to the formula
        formula = formula.slice(0,formula.length-1); 
    }
    output += str;
    formula += str;
    display.textContent = output;
    //console.log('formula: ',formula);
}

function handleOperator(str){
    //if an operator was pressed before remove the previously entered operator
    if(isOperator(formula[formula.length-1])){
        formula = formula.splice(0,formula.length-1);
    }
    //if equals sign or number was pressed before, the result of previous calculation is the first operand of new expression
    else {
        if(!calculated){
            calculate();
        }
        calculated = false;
        formula = `${prevValue}`;
        output = `${prevValue}`;
    }
    formula += str;
    display.textContent = output;
    // console.log('formula: ',formula);
}

function handleDecimal(str){
    //if decimal was entered following an operator or after pressing equals sign 
   if(calculated || isOperator(formula[formula.length-1])){
    if(calculated){
        calculated = false;
        formula = '0'; 
    }
    output = '0';
    }
      //If there is already a decimal in the number entered so far
    if(/\./.test(output))
        return;

    output += str;
    formula += str;
    display.textContent = output;
    // console.log('formula: ',formula);
}

function handleDelete(){
    //console.log('handle Delete called');

    //if previous expression has been evaluated, do nothing
    if(calculated)
        return;
    //If previously a number or decimal was entered
    if(/^[\d|\.]$/.test(formula[formula.length-1])){
        formula = formula.slice(0,formula.length-1)
        output = output.slice(0,output.length-1);
        if(formula===''){
            formula = output = '0';
        }
        display.textContent = output;
    }
    // console.log('formula: ',formula);
    // console.log('output: ', output);
}

function calculate(){
    const answer = eval(formula.replace(/x/g, '*'));
    if(answer === Infinity || isNaN(answer))
        display.textContent='Whoops!';
    else
        display.textContent = answer;   
    prevValue = answer;
    calculated = true;
}

function clearAll(){
    formula = '0';
    output = '0';
    prevValue = 0;
    calculated = false;
    display.textContent = output;
}

function handleKeyPress(event){
    //console.log(event);
    const key = event.key;
   
    if(/[0-9]/.test(key))
       handleNumber(key)
    else if(/[-+\*\/]/.test(key))
        handleOperator(key.replace(/\*/, 'x'));
    else if(/\./.test(key))
        handleDecimal(key);
    else if(/=|Enter/.test(key))
        calculate();
    else if(/Backspace/.test(key))
        handleDelete();

}
document.addEventListener('keydown',handleKeyPress);

document.querySelectorAll('.btn')
    .forEach(button=>{
        let eventHandler;
        if(button.classList.contains('number'))
            eventHandler = handleNumber;
        else if(button.classList.contains('operator'))
            eventHandler = handleOperator;
        else if(button.classList.contains('decimal'))
            eventHandler = handleDecimal;
        else if(button.classList.contains('equal'))
          eventHandler = calculate;
        else if(button.classList.contains('bkspace'))
          eventHandler = handleDelete;
        else if(button.classList.contains('clear'))
          eventHandler = clearAll;

        button.addEventListener('click',(event)=>eventHandler(event.target.value))
    });