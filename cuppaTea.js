/*

DATA MODULE
- Calculate timer according to tea variables

UI MODULE
- Get option values from dropdown

CONTROLLER MODULE
- Add event handler


*/
////////////////////////////////////////////////////////////////////////////////// Data Controller


var dataController = (function() {
  var seconds;


  var tea = {
    cupType: {
      mug: [0, 0], // numbers are the timings (secs) to be used for timer
      glass: [30, 100],
      teaCup: [30, 100]
    },
    cupSurfaceArea: {
      small: [0, 0],
      medium: [30, 60],
      large: [70, 140]
    },
    milk: {
      none: [0, 0],
      skimmed: [0, 160],
      semi: [0, 80],
      whole: [0, 40],
      single: [0, 20],
      double: [0, 0],
      almond: [0, 40],
      coconut: [0, 40],
      soya: [0, 40]
    },
    milkAmount: {
      none: [0, 200],
      little: [30, 100],
      average: [50, 50],
      lots: [70, 0]
    },
    roomTemp: {
      cold: [70, 200],
      mild: [30, 100],
      hot: [0, 0]
    },
    cupColour: {
      white: [0, 0],
      black: [30, 60],
      mediumDarkness: [20, 40]
    }
  };

  return {
    addVariables: function(type, surface, mlk, mlkAmount, rmTmp, clr, num) {
      // duration (in ms) for each category, stored in array
      var timerArr = [tea.cupType[type][num], tea.cupSurfaceArea[surface][num], tea.milk[mlk][num], tea.milkAmount[mlkAmount][num], tea.roomTemp[rmTmp][num], tea.cupColour[clr][num]];
      console.log(timerArr);
      return timerArr;

    },

    calcTimer: function(maxDuration, timings) {
      var timeSecs, timeMs;
      time = maxDuration - (timings[0] + timings[1] + timings[2] + timings[3] + timings[4] + timings[5])
      console.log(time);
      // time is in seconds
      return time;

    }

  };


})();

////////////////////////////////////////////////////////////////////////////////// UI Controller

var UIController = (function() {
  var percent, fly;

  // Finish the DOMstrings for rest of javascript
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

  var changeSpillClr = function(spillClass) {
    var spillArr;
    spillArr = document.getElementsByClassName('spill')
    for (var i = 0; i < spillArr.length; i++) {
      spillArr[i].className = 'spill' + ' ' + spillClass;
    }
  };

  var moveFly = function() {
    fly = document.getElementById('fly');
    fly.style.left = 190 + (percent * 2) + 'px';
    fly.style.top = 475 - (percent * 2) + 'px';
  };

  var formatTime = function(time) {
    var mins, secs, minsDecimal, minsSplit, secsFraction, minsSecs
    // turn seconds into minutes and seconds
    minsDecimal = (time / 60).toFixed(2)
    minsSplit = minsDecimal.split('.');
    mins = minsSplit[0];
    secsFraction = minsSplit[1];
    secs = Math.round((secsFraction * 60) / 100);
    minsSecs = mins + ' minutes ' + secs + ' seconds';
    return minsSecs;
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
      changeSpillClr(mlkAmount);
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

    displayFirstTimer: function(time, mlkAmount) {
      var fly, talking, percentage, x, percent, ms;
      fly = document.getElementById('fly');
      talking = document.getElementById("talking");
      percentage = document.getElementById("percentage");
      percent = 0;
      ms = time * 10;
      x = setInterval(frame, ms);
      talking.innerHTML = 'Cooling down. Be patient...';
      percentage.innerHTML = percent * 1 +'% ready';
      // text colour white if tea is black
      if (mlkAmount === 'none') {
        talking.style.color = 'white';
        percentage.style.color = 'white';
      } else {
        talking.style.color = 'black';
        percentage.style.color = 'black';
      }
      // function frame peforms each interval
      function frame() {
        percent++;
        moveFly();
        if (percent == 100) {
          talking.innerHTML = 'Drink Up!';
          percentage.innerHTML = percent * 1 +'% ready';
          clearInterval(x);
        } else if (percent > 2 && percent < 8) {
          talking.innerHTML = 'Watch out for the fly... ';
          percentage.innerHTML = percent * 1 +'% ready';
        } else if (percent > 10 && percent < 28) {
          talking.innerHTML = 'Mmmmmmm Tea... ';
          percentage.innerHTML = percent * 1 +'% ready';
        } else {
          talking.innerHTML = 'Cooling down. Be patient... ';
          percentage.innerHTML = percent * 1 +'% ready';
        }
      }
    },

    secondTimer: function(time) {
      var displayTime = formatTime(time);
      console.log(displayTime);
      x = setInterval(countDown, 1000);
      function countDown() {
        time--;
        console.log(time);
        if (time === 0){
          clearInterval(x);
          alert('Drink Up your tea\'s getting cold!')
        }

      }
    },






    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();


////////////////////////////////////////////////////////////////////////////////// Global Controller


var controller = (function(dataCtrl, UICtrl) {
  var input;

  var setupEventListeners = function() {
    var optionsArr, dom;
    optionsArr = [].slice.call(document.getElementsByClassName('option'));
    // loops through optionsArr (array)
    optionsArr.forEach(function(element) {
      element.addEventListener("click", changeImage);
    });
    dom = UICtrl.getDOMstrings();
    document.getElementById(dom.setTimer).addEventListener('click', setTimers);
  };

  var changeImage = function() {
    // Get field data
    inputData();
    // Display new image according to input object
    UICtrl.adjustImage(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour)
  };


  var setTimers = function() {
    // Get field data. Input variable will be an object with choices selected
    inputData();
    // Get time data according to variables
    var timerArr1 = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour, 0);
    var timerArr2 = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour, 1);

    // Calculate times
    var time1 = dataCtrl.calcTimer(465, timerArr1);
    var time2 = dataCtrl.calcTimer(1380, timerArr2);

    // Start and display first timer progress and alert when complete
    UICtrl.displayFirstTimer(time1, input.milkAmount);

    // Start/display second timer time, same time as first - progress not visible
    UICtrl.secondTimer(time2);

    // Display time until second alert, in mins/secs

    /* To do:
    - finished tea button - cancels second timer
    - disable options whilst timing

    */





  };

  var inputData = function() {
    // Input variable is object according to choices
    input = UICtrl.getInput();
    console.log(input);
  };

  return {
    init: function() {
      setupEventListeners();
      changeImage();
    }
  };

})(dataController, UIController);
controller.init();
