( function (){

  //***************************SET VARIABLES ***********************************
  //get input buttons, operators, and our display area
var inputButtons = document.body.getElementsByClassName('bg-gray');
var operatorButtons = document.body.getElementsByClassName('bg-orange');
var displayElement = document.querySelector('#display-window');
var operator, swOperator, result, i, j, k, l, firstOperand, lastOperation, dispFlash, passObj;
var displayVal = 0;
var lastOperand = '';
var test = true;
var counter = 0;
var secondOn = false;
var butID;
//objects used for mapping keyboard input to application logic
var keyObj = { 13:"evaluate", 27:"calc-clear", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "multiply", 107: "add", 109: "subtract", 110: "calc-decimal", 111: "divide", 187: "evaluate", 190: "calc-decimal", 191: "divide", 189: "subtract" };
var shiftKeyObj = { 57: "lft-paren", 48: "rht-paren", 53: "percent", 56: "multiply", 104: "multiply", 187: "add" };

//used by several log functions to set different log bases
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

//***************HANDLES THE UPDATING OF DISPLAY WINDOW*************************
function outputToDisplay ( outputStr ) {
  //if we are getting an input that is too long, just reset
  if( outputStr.length > 15 ){
    displayVal = 0;
    displayElement.style.fontSize = '55px';
    displayElement.innerHTML = "Overflow";
    alert('Number Inputted Is Too Large, Resetting Calculator');
  } else {
    //set display with new value
    displayElement.innerHTML = outputStr;
    //check with DOM to find what font-size our window is set to by main.css
    if(displayElement.style.fontSize === ''){
      displayElement.style.fontSize = window.getComputedStyle( displayElement ).fontSize;
    }
    //reset window to full size on update
    var fontSize = 55;
    displayElement.style.fontSize = '55px';
    //if window is too large, shrink font size until our output fits (min font size set to 12px)
    while (displayElement.offsetWidth > 215 && fontSize >= 12 ) {
        fontSize = (Number(fontSize)- 1);
        displayElement.style.fontSize = (fontSize + 'px');
    }
  }
}
//***********************CLEAR BUTTON IMPLEMENTATION *************************
//if we hit the clear button reset our variables and display
function clearCalc(){
  displayVal = '0';
  firstOperand = '';
  lastOperand = '';
  lastOperation = '';
  operator = '';
  swOperator = '';
  displayElement.style.fontSize = '55px';
  document.querySelector('#calc-clear').innerHTML = 'AC';
}
//********************* +/- BUTTON INPUT  **********************************
//change the value of our displayVal from pos to neg (or vice-versa)
function plusMinus(){
  if( displayVal != '0'){
    if( displayVal.slice(0,1) == '-'){
      displayVal = displayVal.slice(1, displayVal.length);
    }else{
      displayVal = '-' + displayVal;
    }
  }
}
//******************PERCENT BUTTON INPUT STAGING*****************************
//logic here passes current decimal location to moveDec function
//if no decimal is set, we put it at the far right of what we have
function percentMoveDec(){
  var decIndex = displayVal.indexOf('.');
  if( decIndex > -1 ){
    //decimal point set already move right 2 places
    displayVal = moveDec ( decIndex );
  }else {
    //no decimal set, move from right side 2 places
    displayVal += '.';
    displayVal = moveDec( displayVal.length-1 );
  }
}
//***********************PERCENT BUTTON IMPLEMENTATION *************************
//function implements the % calculator function, gets passed the index of the
//current decimal location
function moveDec ( fromIndex ){
  var newStr;
  var strEnd;
  //check if we need to prepend a '0.'  or '0.0'
  if(fromIndex < 3){
    newStr = '0.';
    if( fromIndex == 1){
      newStr = newStr + '0';
    }
    //check if there are digits behind the decimal to keep
    if( fromIndex < displayVal.length -1 ){
      strEnd = displayVal.slice(fromIndex+1, displayVal.length);
      newStr = newStr + displayVal.slice(0, fromIndex) + strEnd;
    }else{
      newStr = newStr + displayVal.slice(0, fromIndex);
    }
  }else{
    //move decimal two place to the right
    var strBefore = displayVal.slice(0, fromIndex-2);
    var strAfter = displayVal.slice( fromIndex-2, fromIndex );
    if( fromIndex < displayVal.length -1 ){
      strEnd = displayVal.slice(fromIndex+1, displayVal.length);
      newStr = strBefore + '.' + strAfter + strEnd;
    }else{
      newStr = strBefore + '.' + strAfter;
    }
  }
  return newStr;
}

//***********************SECOND FUNCTION BUTTON IMPLEMENTATION *************************
//function toggles several buttons to the alternate function they offer
function secondToggle(){
  var firsts = document.getElementsByClassName('first-function');
  var seconds = document.getElementsByClassName('second-function');
  console.dir( firsts );
  console.dir( seconds );
  if(secondOn){
    secondOn = false;
    for( j=0; j < firsts.length; j++ ){
      firsts[j].style.display = 'block';
      seconds[j].style.display = 'none';
    }
  }else{
    secondOn = true;
    for( j=0; j < firsts.length; j++ ){
      firsts[j].style.display = 'none';
      seconds[j].style.display = 'block';
    }
  }
}

//***********************INPUT BUTTON PROCESSOR*********************************
//function takes an Object as input with attributes classList and id at a minimum
//Object passed in by click Event Handler is auto filled
//Object passed by keyup Event Handler is built by sortKey and buildObj functions
function processInput( inputObj ){
  //set variable to check on
  butID = inputObj.id;


  //*************NUMBER BUTTON INPUT**************************
  //check if we have hit a number key
  for( j=0; j < inputObj.classList.length; j++ ){
    if( inputObj.classList[j] == 'calc-num'){
      document.querySelector('#calc-clear').innerHTML = 'C';
      if( displayVal == '0'){
        displayVal = inputObj.innerHTML;
      } else {
        displayVal += inputObj.innerHTML;
      }
    }
  }

  switch (butID) {
    case 'calc-clear':
      clearCalc();
      break;
    case 'plus-minus':
      plusMinus();
      break;
    case 'percent':
      percentMoveDec();
      break;
    case 'calc-decimal':
    //************* DECIMAL BUTTON INPUT  *****************************
    //add a decimal point or not depending on existing content
      if( displayVal.indexOf('.') == -1 ){
        displayVal = displayVal + '.';
      }
      break;
    case 'lft-paren':
      //handle left parenthesis
      break;
    case 'rht-paren':
      //handle right parenthesis
      break;
    case 'mem-clear':
      //handle memory clear
      break;
    case 'mem-add':
      //add displayVal to memVal
      break;
    case 'mem-subtract':
      //subtract displayVal from memVal
      break;
    case 'mem-recall':
      //displayVal = memVal and update display
      break;
    case 'second-func':
      //toggle function buttons that have 2nd options feature
      secondToggle();
      break;
    case 'calc-squared':
      //dispVal squared
      displayVal = Math.pow(displayElement.innerHTML, 2);
      break;
    case 'calc-cubed':
      //dispVal cubed
      displayVal = Math.pow(displayElement.innerHTML, 3);
      break;
    case 'calc-xtoy':
      //dispVal to the y power
      processOperator(inputObj);
      break;
    case 'calc-etox':
      //e to the x power
      displayVal = Math.pow(Math.E  , displayElement.innerHTML);
      break;
    case 'calc-ytox':
      //takes the second input and makes it the base, first input the exponent
      processOperator(inputObj);
      break;
    case 'calc-tentox':
      //ten to the x power
      displayVal = Math.pow( 10  , displayElement.innerHTML);
      break;
    case 'calc-twotox':
      //two to the x power
      displayVal = Math.pow( 2  , displayElement.innerHTML);
      break;
    case 'calc-inverse':
      //value of 1 divided by dispVal
      displayVal = 1 / displayElement.innerHTML;
      break;
    case 'calc-sqrt':
      //disVal square root
      displayVal = Math.sqrt(displayElement.innerHTML);
      break;
    case 'calc-cube-root':
      //dispVal cube root
      displayVal = Math.cbrt(displayElement.innerHTML);
      break;
    case 'calc-xroot':
      //dispVal x power root
      processOperator(inputObj);
      break;
    case 'calc-ln':
      //natural log
      displayVal = Math.log(displayElement.innerHTML);
      break;
    case 'calc-logy':
      //regular logarithm
      processOperator(inputObj);
      break;
    case 'calc-logten':
      //log base 10
      displayVal = getBaseLog( 10, displayElement.innerHTML);
      break;
    case 'calc-logtwo':
      //log base 2
      displayVal = getBaseLog( 2, displayElement.innerHTML);
      break;
    case 'calc-factorial':
      //value of 1 divided by dispVal
      break;
    case 'calc-sin':
      //disVal square root
      break;
    case 'calc-arcsin':
      //dispVal cube root
      break;
    case 'calc-cos':
      //dispVal x power root
      break;
    case 'calc-arccos':
      //natural log
      break;
    case 'calc-tan':
      //regular logarithm
      break;
    case 'calc-arctan':
      //log base 10
      break;
    case 'const-e':
      //Euler's number
      displayVal = Math.E;
      break;
    case 'calc-enter-exponent':
      //log base 2
      break;
    case 'calc-radian':
      //value of 1 divided by dispVal
      break;
    case 'calc-sinh':
      //disVal square root
      break;
    case 'calc-arcsinh':
      //dispVal cube root
      break;
    case 'calc-cosh':
      //dispVal x power root
      break;
    case 'calc-arccosh':
      //natural log
      break;
    case 'calc-tanh':
      //regular logarithm
      break;
    case 'calc-arctanh':
      //log base 10
      break;
    case 'const-pi':
      //pi
      displayVal = Math.PI;
      break;
    case 'calc-random':
      //log base 2
      break;
    default:
  }

  outputToDisplay ( displayVal );
}


//**********************OPERATOR BUTTON PROCESSOR*******************************
//function takes an Object as input with attribute  id at a minimum
//Object passed in by click Event Handler is auto filled
//Object passed by keyup Event Handler is built by sortKey and buildObj functions
function processOperator( operatorObj ){
  // on operator input we flash the displayVal for 10 miliseconds to give a
  // visual reference to the user (per Apple Calc functionality)
  // -- see setTimeout at end of each part here
  outputToDisplay( '' );
  //check if we need to evaluate the current expression or set operation
  if( operatorObj.id != 'evaluate' ){
    //save the operation to do and save the first operand value
    operator = operatorObj.id;
    firstOperand = displayVal;
    dispFlash = false;
    lastOperand = '';
    setTimeout(flashDisp, 10);
  } else {
    //execute the operation
    //check that our firstOperand is set and a valid type to operate on
    if( typeof firstOperand == 'number' || typeof firstOperand == 'string') {

      //set lastOperand to use if we get evaluated again after this, but only if
      // it is currently not set (otherwise we might be on the 2nd run already!)
      if(lastOperand === ''){
        lastOperand = displayVal;
      }
      //set our variable to use in the switch statement, if operator is set, we
      //use that, if operator is not set (we just performed an operation and
      // are doing another evaluation immediately), then we switch on the lastOperation
      if(operator !== ''){
        swOperator = operator;
      }else if (lastOperation !== '') {
        swOperator = lastOperation;
      }
      //debugging code
      // console.log('firstOperand is: ', firstOperand);
      // console.log('operator is: ', operator);
      // console.log('displayVal is: ', displayVal);
      // console.log('swOperator is: ', swOperator);
      // console.log('lastOperand is: ', lastOperand);
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
        case 'calc-xtoy':
          //firstOperand to the lastOperand power
          displayVal = Math.pow(Number(firstOperand), Number(lastOperand));
          break;
        case 'calc-ytox':
          //takes the second input and makes it the base, first input the exponent
          displayVal = Math.pow(Number(lastOperand), Number(firstOperand));
          break;
        case 'calc-xroot':
          //dispVal x power root
          displayVal = Math.pow( Number(firstOperand), (1 / Number(lastOperand)) );
          break;
        case 'calc-logy':
          //regular logarithm
          displayVal = getBaseLog(lastOperand, firstOperand);
          break;
      }
      // console.log('result of the operation is: ', displayVal);
      // reset variables for use in next operation(s)
      //new operand is result of this operation
      firstOperand = displayVal;
      //save the operation we did (in case we need it on another immediate eval)
      lastOperation = operator;
      //unset operator so switch will use lastOperation on another immediate eval
      operator = '';
      //pass logic to flashDisp()
      dispFlash = true;
      setTimeout(flashDisp, 10);
    }
  }
}

//*************************** flashDisp ****************************************
//handler that finishes display output after setTimeout flashes display window
//on operator input

function flashDisp () {
  if( dispFlash ){
    outputToDisplay ( displayVal );
    dispFlash = false;
  }else{
    outputToDisplay ( displayVal );
    displayVal = '0';
  }
}

//********************MOUSE INPUT PASS THROUGH FUNCTIONS ***********************
//handler functions that pass click event object to processor functions, this
//lets us use the same processor function to handle keyboard or mouse input
function collectOperator(){
  processOperator(this);
}
function collectInput(){
  processInput(this);
}
//********************KEYBOARD INPUT PROCESSOR FUNCTIONS ***********************
//***********************       buildObj           *****************************
//builds an object with the correct parameters to match the DOM Element that
//corresponds to the key inputted, this lets us use the same function to process
//input from either source
function buildObj( key ){
  var id, innerHTML;
  var classList = [];
  var tempObj;
  if( ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(key) > -1){
    //build attributes based on calc-num selector for inputs function
    classList.push( 'calc-num' );
    tempObj = { 'classList': classList, 'innerHTML':key  };
    processInput(tempObj);
  }else if( ['divide', 'multiply', 'subtract', 'add', 'evaluate'].indexOf(key) > -1){
    //send to operator function
    tempObj = {'id': key };
    processOperator(tempObj);
  }else if( ['percent', 'calc-decimal', 'calc-clear'].indexOf(key) > -1 ){
    tempObj = {'id': key, 'classList':''};
    processInput(tempObj);
  }
}
//***********************       sortKey             ****************************
//event handler for keyboard input, passes value to
//build object to pass to processing functions
function sortKey( e ){
  if(shiftKeyObj.hasOwnProperty(e.keyCode) > 0  && e.shiftKey === true ){
    // console.log('key code pressed with shift key active : ' + e.keyCode + ' and key was: ' + shiftKeyObj[e.keyCode] );
    buildObj(shiftKeyObj[e.keyCode]);
  }else if (keyObj.hasOwnProperty(e.keyCode) > 0 ){
    // console.log('key code pressed is: ' + e.keyCode + ' and key was: ' + keyObj[e.keyCode] );
    buildObj(keyObj[e.keyCode]);
  }  else {
    // console.log('key code registered: ' + e.keyCode + ' is not one of the keys we care about');
  }
}

//******************** BUTTON CLICK STYLE FUNCTIONS ****************************
//these just change button styles during the mouseclick
//
// !!!!!  FUTURE UPDATE - ADD EVENT HANDLER AND FUNCTIONS
// !!!!!  TO CHANGE STYLES ON KEYDOWN & KEYUP
function changeDownBG( e ) {
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

//------------------------------------------------------------------------------
//                              ADD EVENT LISTENERS
//------------------------------------------------------------------------------

//***********************listeners for input buttons****************************
for (i=0; i<inputButtons.length; i++){
  inputButtons[i].addEventListener( 'click', collectInput );
  inputButtons[i].addEventListener( 'mousedown', changeDownBG );
  inputButtons[i].addEventListener( 'mouseup', changeUpBG );
  inputButtons[i].addEventListener( 'mouseleave', changeUpBG );
}

//***********************listeners for operator buttons*************************
for ( i=0; i<operatorButtons.length; i++ ) {
  operatorButtons[i].addEventListener('click', collectOperator );
  operatorButtons[i].addEventListener( 'mousedown', changeDownBG );
  operatorButtons[i].addEventListener( 'mouseup', changeUpBG );
  operatorButtons[i].addEventListener( 'mouseleave', changeUpBG );
}
//***********************listener for keyboard input****************************
window.addEventListener( 'keyup', sortKey );
}());
