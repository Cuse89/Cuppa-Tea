/*

DATA MODULE
- Calculate timer according to tea variables

UI MODULE
- Get option values from dropdown

CONTROLLER MODULE
- Add event handler


*/
////////////////////////////////////////////////////////////////////////////////// Timer Controller


var timerController = (function() {
  var seconds;


  var tea = {
    cupType: {
      mug: 0, // numbers are the timings to be used for timer
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
      little: 30000,
      average: 50000,
      lots: 70000
    },
    roomTemp: {
      cold: 30000,
      mild: 15000,
      hot: 0
    },
    cupColour: {
      white: 0,
      black: 30000,
      mediumDarkness: 10000
    }
  };

  return {
    addVariables: function(type, surface, mlk, mlkAmount, rmTmp, clr) {
      // duration (in ms) for each category, stored in array
      var timerArr = [tea.cupType[type], tea.cupSurfaceArea[surface], tea.milk[mlk], tea.milkAmount[mlkAmount], tea.roomTemp[rmTmp], tea.cupColour[clr]];
      console.log(timerArr);
      return timerArr;

    },

    calcTimer: function(timings) {
      // 6 mins perfect time - 360000 ms
      // average cup = 105000 ms
      // 360000 + 105000 = 465000
      var time;
      time = 465000 - (timings[0] + timings[1] + timings[2] + timings[3] + timings[4] + timings[5])
      console.log(time);
      // time is in ms
      return time;

    }

  };


})();

////////////////////////////////////////////////////////////////////////////////// UI Controller

var UIController = (function() {

  var DOMstrings = {
    setTimer: 'set_timer',
    cupType: 'cup_type',
    surface: 'surface',
    milk: 'milk',
    milkAmount: 'milk_amount',
    roomTemp: 'room_temp',
    cupColour: 'cup_colour',
    countDown: 'countdown'
  };

  var changeSpill = function(spillClass) {
    var spillArr;
    spillArr = document.getElementsByClassName('spill')
    for (var i = 0; i < spillArr.length; i++) {
      spillArr[i].className = 'spill' + ' ' + spillClass;
    }
  };

  return {

    adjustImage: function(type, surface, mlk, mlkAmount, rmTmp, clr) {
      console.log(type, surface, mlk, mlkAmount, rmTmp, clr);
      if (type === 'glass') {
        // blank out cup colour option + hide handle
        document.getElementById('cup_colour').value = 'white';
        document.getElementById('cup_colour').disabled = true;
        document.querySelector('.handle').style.display = 'none';
      } else {
        document.getElementById('cup_colour').disabled = false;
        document.querySelector('.handle').style.display = '';
      };
      if (mlk === 'none') {
        document.getElementById('milk_amount').disabled = true;
        document.getElementById('milk_amount').value = 'none';
      } else {
        document.getElementById('milk_amount').disabled = false;
      }
      // change class names according to options
      document.querySelector('.tea').className = 'tea' + ' ' + surface + ' ' + mlkAmount;
      document.querySelector('.cup').className = 'cup' + ' ' + type + ' ' + surface + ' ' + clr;
      document.querySelector('.handle').className = 'handle' + ' ' + type + ' ' + surface + ' ' + clr;
      document.querySelector('.ripple').className = 'ripple' + ' ' + mlkAmount;
      changeSpill(mlkAmount);
      document.body.className = rmTmp;


    },


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

    displayTimer: function(time) {
      seconds = time / 1000;
      var tm = setInterval(countDown, 1000);

      function countDown() {
        seconds--;
        if (seconds == 0) {
          clearInterval(tm);
          alert('Your tea is ready to drink');
        }
        document.getElementById(DOMstrings.countDown).textContent = seconds
        console.log(seconds);
      }
    },


    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();


////////////////////////////////////////////////////////////////////////////////// Global Controller


var controller = (function(timerCtrl, UICtrl) {
  var input;

  var setupEventListeners = function() {
    var optionsArr, DOM;
    optionsArr = [].slice.call(document.getElementsByClassName('option'));
    // loops through optionsArr (array)
    optionsArr.forEach(function(element) {
      element.addEventListener("click", changeImage);
    });
    DOM = UICtrl.getDOMstrings();
    document.getElementById(DOM.setTimer).addEventListener('click', setTimer);
  };

  var inputData = function() {
    // Input variable is object according to choices
    input = UICtrl.getInput();
    console.log(input);
  };

  var changeImage = function() {
    // Get field data
    inputData();
    // Display new image according to input object
    UICtrl.adjustImage(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour)
  };


  var setTimer = function() {
    // Get field data. Input variable will be an object with choices selected
    inputData();
    // Get time data according to variables
    timerArr = timerCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour);


    // Calculate time
    time = timerCtrl.calcTimer(timerArr)

    // Display timer
    currentTime = UICtrl.displayTimer(time);

    // Alert

  };

  return {
    init: function() {
      setupEventListeners();
      changeImage();
    }
  };

})(timerController, UIController);
controller.init();
