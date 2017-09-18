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
  var percent, fly, brewCount, coldCount, animation;

  // Finish the DOMstrings for rest of javascript
  var DOMstrings = {
    setTimer: 'set_timer',
    reset: 'reset',
    cupType: 'cup_type',
    surface: 'surface',
    milk: 'milk',
    milkAmount: 'milk_amount',
    roomTemp: 'room_temp',
    cupColour: 'cup_colour',
    timer: 'select_timers',
    countDown: 'countdown'
  };

  var changeSpillClr = function(spillClass) {
    var spillArr;
    spillArr = document.getElementsByClassName('spill')
    for (var i = 0; i < spillArr.length; i++) {
      spillArr[i].className = 'spill' + ' ' + spillClass;
    }
  };

  var formatTime = function(time) {
    var mins, secs, minsDecimal, minsSplit, secsFraction, minsSecs
    mins = Math.floor(time / 60)
    secs = time % 60
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
      var timerValue;
      if (document.getElementById('brew').checked) {
        timerValue = document.getElementById('brew').value;
      } else if (document.getElementById('cold').checked) {
        timerValue = document.getElementById('cold').value;
      } else if (document.getElementById('both').checked) {
        timerValue = document.getElementById('both').value;
      }
      console.log(timerValue);
      return {
        cupType: document.getElementById(DOMstrings.cupType).value,
        surface: document.getElementById(DOMstrings.surface).value,
        milk: document.getElementById(DOMstrings.milk).value,
        milkAmount: document.getElementById(DOMstrings.milkAmount).value,
        roomTemp: document.getElementById(DOMstrings.roomTemp).value,
        cupColour: document.getElementById(DOMstrings.cupColour).value,
        timer: timerValue
      }
    },

    brewTimer: function(time, mlkAmount) {
      var talking, percentage, brewDisplay, ms, bar;
      talking = document.getElementById('talking');
      brewDisplay = document.getElementById('brew_display');
      bar = document.getElementById('bar1');
      percent = 0;
      ms = time * 10;
      brewCount = setInterval(frame, ms);
      brewDisplay.innerHTML = 'Cooling down. Be patient...' + percent * 1 + '% ready';
      // function frame peforms each interval
      function frame() {
        percent++;
        if (percent == 100) {
          brewDisplay.innerHTML = 'Drink Up! ' + percent * 1 + '% ready';
          clearInterval(brewCount);
        } else if (percent > 2 && percent < 8) {
          brewDisplay.innerHTML = 'Watch out for the fly... ' + percent * 1 + '% ready';
        } else if (percent > 10 && percent < 28) {
          brewDisplay.innerHTML = 'Mmmmmmm Tea... ' + percent * 1 + '% ready';
        } else {
          brewDisplay.innerHTML = 'Cooling down. Be patient... ' + percent * 1 + '% ready';
        }
      }
    },

    coldTimer: function(time) {
      var displayTime = formatTime(time);
      coldDisplay = document.getElementById('cold_display')
      coldDisplay.innerHTML = displayTime;
      coldCount = setInterval(coldCountDown, 1000);

      function coldCountDown() {
        time--;
        displayTime = formatTime(time);
        coldDisplay.innerHTML = displayTime;
        if (time === 0) {
          clearInterval(coldCount);
          alert('Drink Up your tea\'s getting cold!')
        }
      }
    },

    progressBarWidth: function(wrapper) {
      document.getElementById(wrapper).style.width = '100%'

    },

    progressBarWidthBoth: function(brew, cold) {
      document.getElementById('brew_wrapper').style.width = (brew / cold) * 100 + '%';
      document.getElementById('cold_wrapper').style.width = 100 - ((brew / cold) * 100) + '%';
    },

    progressBarAnimate: function(time, divId) {
      var width, timeInMs;
      width = document.getElementById(divId).offsetWidth
      console.log(width);
      timeInMs = time * 1000;
      animation = document.querySelector('.bar').animate({
        width: ['0px', width + 'px']
      }, timeInMs)
    },

    progressBarAnimateBoth: function(time) {
      var timeInMs;
      timeInMs = time * 1000;
      animation = document.querySelector('.bar').animate({
        width: ['0%', '100%']
      }, timeInMs)
    },

    reset: function() {
      clearInterval(brewCount);
      clearInterval(coldCount);
      document.getElementById('brew_wrapper').style.width = 0;
      document.getElementById('cold_wrapper').style.width = 0;
      document.getElementById('brew_display').innerHTML = '';
      document.getElementById('cold_display').innerHTML = '';
      animation.cancel();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  }

})();


////////////////////////////////////////////////////////////////////////////////// Global Controller


var controller = (function(dataCtrl, UICtrl) {
  var input, dom;

  var setupEventListeners = function() {
    var optionsArr;
    optionsArr = [].slice.call(document.getElementsByClassName('option'));
    // loops through optionsArr (array)
    optionsArr.forEach(function(element) {
      element.addEventListener('click', changeImage);
    });
    dom = UICtrl.getDOMstrings();
    document.getElementById(dom.setTimer).addEventListener('click', setTimers);
    document.getElementById(dom.reset).addEventListener('click', reset);
  };

  var changeImage = function() {
    // Get field data
    inputData();
    // Display new image according to input object
    UICtrl.adjustImage(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour)
  };


  var setTimers = function() {
    // Disable/ enable button
    disableTimerBtn();
    // Get field data. Input variable will be an object with choices selected
    inputData();
    // Get time data according to variables
    var timerArr1 = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour, 0);
    var timerArr2 = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.cupColour, 1);

    // Calculate times
    var timeBrew = dataCtrl.calcTimer(465, timerArr1);
    var timeCold = dataCtrl.calcTimer(1380, timerArr2);
    var timeBoth = timeBrew + timeCold
    console.log(timeBoth);

    if (input.timer === 'brew') {
      // Start and display first timer progress and alert when complete
      UICtrl.progressBarWidth('brew_wrapper');
      UICtrl.brewTimer(timeBrew, input.milkAmount);
      UICtrl.progressBarAnimate(timeBrew, 'brew_wrapper');
    } else if (input.timer === 'cold') {
      // Start/display second timer time, same time as first - progress not visible
      UICtrl.progressBarWidth('cold_wrapper');
      UICtrl.coldTimer(timeCold);
      UICtrl.progressBarAnimate(timeCold, 'cold_wrapper');
    } else if (input.timer === 'both') {
      UICtrl.progressBarWidthBoth(timeBrew, timeCold)
      UICtrl.brewTimer(timeBrew, input.milkAmount);
      UICtrl.coldTimer(timeCold);
      UICtrl.progressBarAnimateBoth(timeCold);

    }




    /* To do:
    - finished tea button - cancels second timer
    - disable options whilst timing
    -

    */

  };

  var reset = function() {
    enableTimerBtn();
    UICtrl.reset();
  };

  var enableTimerBtn = function() {
    document.getElementById(dom.reset).disabled = true;
    document.getElementById(dom.setTimer).disabled = false;
  };

  var disableTimerBtn = function() {
    document.getElementById(dom.reset).disabled = false;
    document.getElementById(dom.setTimer).disabled = true;
  }

  var inputData = function() {
    // Input variable is object according to choices
    input = UICtrl.getInput();
    console.log(input);
  };

  return {
    init: function() {
      setupEventListeners();
      changeImage();
      enableTimerBtn();
    }
  };

})(dataController, UIController);
controller.init();
