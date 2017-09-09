/*

DATA MODULE
- Calculate timer according to tea variables

UI MODULE
- Get option values from dropdown

CONTROLLER MODULE
- Add event handler


*/
////////////////////////////////////////////////////////////////////////////////// Timer Controller

/* Sort data structure out, each variable in object e.g size, needs to be own object with 3 following functions - small, medium, large*/

var timerController = (function() {


  var tea = {
    cupType: {
      mug: 0,    // numbers are the timings to be used for timer
      glass: 30000,
      teaCup: 30000,
    },
    cupSurfaceArea: {
      small: 0,
      medium: 20000,
      large: 40000
    },
    milk: {
      none: 0,
      skimmed: 10000,
      semi: 10000,
      whole: 10000,
      single: 10000,
      double: 10000,
      almond: 10000,
      coconut: 10000,
      soya: 10000
    },
    milkAmount: {
      none: 0,
      small: 30000,
      average: 50000,
      lots: 70000
    },
    roomTemp: {
      cold: 30000,
      average: 15000,
      hot: 0
    },
    cupColour: {
      white: 0,
      black: 30000,
      medium: 10000,
      transparent: 10000
    }
  };

  return {
    addVariables: function(type, surface, mlk, mlkAmount, rmTmp, clr) {

      var timerArr = [tea.cupType[type], tea.cupSurfaceArea[surface], tea.milk[mlk], tea.milkAmount[mlkAmount], tea.roomTemp[rmTmp], tea.cupColour[clr]];

      return timerArr;

    },

    calcTimer: function(timings) {
      // 6 mins perfect time - 360000 ms
      // average cup = 105000 ms
      // 360000 + 105000 = 465000
      var time;
      time = 465000 - (timings[0] + timings[1] + timings[2] + timings[3] + timings[4] + timings[5])
      return time;
    },

    startTimer: function(time) {
      seconds = time / 1000;
      var tm = setInterval(countDown,1000);
      function countDown(){
        seconds--;
        if(seconds == 0){
           clearInterval(tm);
           alert('Your tea is ready to drink');
        }
        console.log(seconds);

     }
   },





  };




})();

////////////////////////////////////////////////////////////////////////////////// UI Controller

var UIController = (function() {

  var DOMstrings = {
    timer: 'timer',
    cupType: 'cup_type',
    surface: 'surface',
    milk: 'milk',
    milkAmount: 'milk_amount',
    roomTemp: 'room_temp',
    cupColour: 'cup_colour'
  };

  return {

    getInput: function() {
      return {
        cupType: document.getElementById(DOMstrings.cupType).value,
        surface: document.getElementById(DOMstrings.surface).value,
        milk: document.getElementById(DOMstrings.milk).value,
        milkAmount: document.getElementById(DOMstrings.milkAmount).value,
        roomTemp: document.getElementById(DOMstrings.roomTemp).value,
        cupColour: document.getElementById(DOMstrings.cupColour).value
      }
    },


    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();


////////////////////////////////////////////////////////////////////////////////// Global Controller


var controller = (function(timerCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.getElementById(DOM.timer).addEventListener('click', setTimer);
  };

  // click button
  // calculate timer
  // start timer
  // alert

  var setTimer = function() {
    var input, time, currentTime
    // Get field data
    input = UICtrl.getInput();

    // Get time data according to variables
    timerArr = timerCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour);


    // Calculate timer
    time = timerCtrl.calcTimer(timerArr)
    console.log(time);

    // Set timer
    currentTime = timerCtrl.startTimer(time);

    // Get timer seconds
  

    // Display time



    // Alert

  };

  return {
    init: function() {
      setupEventListeners();
    }
  };

})(timerController, UIController);
controller.init();
