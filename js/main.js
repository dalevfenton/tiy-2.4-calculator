( function (){

var inputButtons = document.body.getElementsByClassName('bg-gray');
var operatorButtons = document.body.getElementsByClassName('bg-orange');
var operator, swOperator, result, i, j, k, l;
var displayVal = 0;
var firstOperand, lastOperation;
var lastOperand = '';

//move decimal point 2 places right
function moveDec ( fromIndex, wholeStr ){
  var newStr;
  var strEnd;
  //check if we need to prepend a '0.'  or '0.0'
  if(fromIndex < 3){
    newStr = '0.';
    if( fromIndex == 1){
      newStr = newStr + '0';
    }
    //check if there are digits behind the decimal to keep
    if( fromIndex < wholeStr.length -1 ){
      strEnd = wholeStr.slice(fromIndex+1, wholeStr.length);
      newStr = newStr + wholeStr.slice(0, fromIndex) + strEnd;
    }else{
      newStr = newStr + wholeStr.slice(0, fromIndex);
    }
  }else{
    //move decimal two place to the right
    var strBefore = wholeStr.slice(0, fromIndex-2);
    var strAfter = wholeStr.slice( fromIndex-2, fromIndex );
    if( fromIndex < wholeStr.length -1 ){
      strEnd = wholeStr.slice(fromIndex+1, wholeStr.length);
      newStr = strBefore + '.' + strAfter + strEnd;
    }else{
      newStr = strBefore + '.' + strAfter;
    }
  }
  return newStr;
}

function outputToDisplay ( outputStr ) {

}

function collectInput(){
  //check if we have hit a number key
  for( j=0; j < this.classList.length; j++ ){
    if( this.classList[j] == 'calc-num'){
      document.querySelector('#calc-clear').innerHTML = 'C';
      if( displayVal == '0'){
        displayVal = this.innerHTML;
      } else {
        displayVal += this.innerHTML;
      }
    }
  }

  //if we hit the clear button reset our variables and display
  if(this.id == 'calc-clear'){
    displayVal = '0';
    firstOperand = '';
    lastOperand = '';
    lastOperation = '';
    operator = '';
    swOperator = '';
    document.querySelector('#calc-clear').innerHTML = 'AC';
  }

  //change the value of our stuff from pos to neg
  if(this.id == 'plus-minus'){
    if( displayVal != '0'){
      if( displayVal.slice(0,1) == '-'){
        displayVal = displayVal.slice(1, displayVal.length);
      }else{
        displayVal = '-' + displayVal;
      }
    }
  }

  //update variables such that we move the decimal two places to the left
  if(this.id == 'percent'){
    var decIndex = displayVal.indexOf('.');
    if( decIndex > -1 ){
      //decimal point set already move right 2 places
      displayVal = moveDec ( decIndex, displayVal );
    }else {
      //no decimal set, move from right side 2 places
      displayVal += '.';
      displayVal = moveDec( displayVal.length-1, displayVal );
    }
  }

  //add a decimal point or not depending on existing content
  if(this.id == 'calc-decimal'){
    if( displayVal.indexOf('.') == -1 ){
      displayVal = displayVal + '.';
    }
  }

  document.querySelector('#display > span').innerHTML = displayVal;
}

function collectOperator( ){
  // console.dir( this );
  if( this.id != 'evaluate' ){
    //save the operation to do and save the first operand value
    operator = this.id;
    firstOperand = displayVal;
    displayVal = '0';
  } else {
    //execute the operation
    console.log('firstOperand is: ', firstOperand);
    console.log('operator is: ', operator);
    console.log('displayVal is: ', displayVal);
    if( typeof firstOperand == 'number' || typeof firstOperand == 'string') {
      if(lastOperand === ''){
        lastOperand = displayVal;
      }
      if(operator !== ''){
        swOperator = operator;
      }else if (lastOperation !== '') {
        swOperator = lastOperation;
      }else {
        console.log( 'no operator to execute switch with!');
      }
      switch(swOperator) {
        case 'divide':
          displayVal = Number(firstOperand) / Number(lastOperand);
          break;
        case 'multiply':
          displayVal = Number(firstOperand) * Number(lastOperand);
          break;
        case 'subtract':
          displayVal = Number(firstOperand) - Number(lastOperand);
          break;
        case 'add':
          displayVal = Number(firstOperand) + Number(lastOperand);
          break;
      }
      console.log('result of the operation is: ', displayVal);
      document.querySelector('#display > span').innerHTML = displayVal;
      firstOperand = displayVal;
      lastOperation = operator;
      operator = '';
    }
  }
}

function changeDownBG( e ) {
  console.dir ( e );
  e.preventDefault();
  for( l=0; l < this.classList.length; l++ ){
    if( this.classList[l] == 'bg-gray'){
      //bg color for gray buttons
      this.style.backgroundColor = 'rgba(178, 178, 178, 1)';
    } else if(this.classList[l] == 'bg-orange'){
      //bg and font color for orange buttons
      this.style.backgroundColor = 'rgba(196, 115, 37, 1)';
      this.style.color = 'rgba(94, 103, 106, 1)';
    }
  }
}

function changeUpBG(){
  for( l=0; l < this.classList.length; l++ ){
    if( this.classList[l] == 'bg-gray'){
      //bg color for gray buttons
      this.style.backgroundColor = 'rgba(224, 224, 224, 1)';
    } else if(this.classList[l] == 'bg-orange'){
      //bg and font color for orange buttons
      this.style.backgroundColor = 'rgba(246, 146, 49, 1)';
      this.style.color = 'rgba(255, 255, 255, 1)';
    }
  }
}

for (i=0; i<inputButtons.length; i++){
  inputButtons[i].addEventListener( 'click', collectInput );
  inputButtons[i].addEventListener( 'mousedown', changeDownBG );
  inputButtons[i].addEventListener( 'mouseup', changeUpBG );
  inputButtons[i].addEventListener( 'mouseleave', changeUpBG );
}

for ( i=0; i<operatorButtons.length; i++ ) {
  operatorButtons[i].addEventListener('click', collectOperator );
  operatorButtons[i].addEventListener( 'mousedown', changeDownBG );
  operatorButtons[i].addEventListener( 'mouseup', changeUpBG );
  operatorButtons[i].addEventListener( 'mouseleave', changeUpBG );
}

}());
