/*
Modules -
-Data Controller -  Stores data for app and calculates times
-UI Controller - Deals with User Interface, and everything visual
-Global Controller - Does not perform actual functions for the app - Links the Data and UI Controllers and brings eveything together. (The main hub)

*/


// Data Controller

const dataController = (function() {

  // Store timer variable in object. Brew timings and Cold timings for each secs
  const tea = {
    cupType: {
      mug: [0, 0],
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
    darkness: {
      white: [0, 0],
      black: [30, 60],
      mediumDarkness: [20, 40]
    },
    timer: [465, 1800]
  };

  return {
    addVariables: function(type, surface, mlk, mlkAmount, rmTmp, dark, tmr, num) {
      const timerObj = {
        type: tea.cupType[type][num],
        surface: tea.cupSurfaceArea[surface][num],
        milk: tea.milk[mlk][num],
        milkAmount: tea.milkAmount[mlkAmount][num],
        roomTemp: tea.roomTemp[rmTmp][num],
        darkness: tea.darkness[dark][num],
        timer: tea.timer[num]
      };
      console.log(timerObj);
      return timerObj;
    },

    calcTimer: function(obj) {
      let time;
      time = obj.timer - (obj.type + obj.surface + obj.milk + obj.milkAmount + obj.roomTemp + obj.darkness);
			console.log(time);
      // time is in seconds
      return time;
    }

  };


})();

////////////////////////////////////////////////////////////////////////////////// UI Controller

const UIController = (function() {
  let percent, fly, brewCount, coldCount, animation, timer;
  let audio = true;
  let alertBrew = 'Your tea is served!'
  let alertCold = 'Drink Up!'


  const changeSpillDark = function(spillClass) {
    let spillArr;
    spillArr = document.getElementsByClassName('spill');
    for (let i = 0; i < spillArr.length; i++) {
      spillArr[i].className = `spill ${spillClass}`;
    }
  };

  const formatTime = function(time) {
    let mins, secs, minsSecs, minString, secString;
    mins = Math.floor(time / 60);
    secs = time % 60;
    minString = ' minutes ';
    secString = ' seconds';
    if (mins === 1) {
      minString = ' minute '
    } else if (secs === 1) {
      secString = ' second'
    }
    minsSecs = mins + minString + secs + secString;
    return minsSecs;
  };

  const displayProgressBars = function() {
    document.getElementById('progress_bars').style.display = 'block';
  };

  const ready = function() {
    audio ? alarm() : displayAlert();
  }

  const alarm = function() {
    const audioBrew = new Audio('bell.mp3');
    const audioCold = new Audio('woop.mp3');
    if (timer === 'brew') {
      audioBrew.play();
      audioBrew.addEventListener("ended", function() {
        audioBrew.currentTime = 0;
        displayAlert();
      });
    } else if (timer === 'cold') {
      audioCold.play();
      audioCold.addEventListener("ended", function() {
        audioCold.currentTime = 0;
        displayAlert();
      });
    }

  };

  const displayAlert = function() {
    timer === 'brew' ? alert(alertBrew) : alert(alertCold);
  }

  return {

    adjustImage: function(type, surface, mlk, mlkAmount, rmTmp, dark) {
      if (type === 'glass') {
        // blank out cup darkness option + hide handle
        document.getElementById('darkness').value = 'white';
        document.getElementById('darkness').disabled = true;
        document.querySelector('.handle').style.display = 'none';
      } else {
        document.getElementById('darkness').disabled = false;
        document.querySelector('.handle').style.display = 'block';
      };
      if (mlk === 'none') {
        document.getElementById('milk_amount').disabled = true;
        document.getElementById('milk_amount').value = 'none';
      } else {
        document.getElementById('milk_amount').disabled = false;
      }
      // change class names according to options
      document.querySelector('.tea').className = `tea ${surface} ${mlkAmount}`;
      document.querySelector('.cup').className = `cup ${type} ${surface} ${dark}`;
      document.querySelector('.handle').className = `handle ${type} ${surface} ${dark}`;
      document.querySelector('.ripple').className = `ripple ${mlkAmount}`;
      changeSpillDark(mlkAmount);
      document.body.className = rmTmp;
    },

    getInput: function() {
      let timerValue;
      if (document.getElementById('brew').checked) {
        timerValue = document.getElementById('brew').value;
      } else if (document.getElementById('cold').checked) {
        timerValue = document.getElementById('cold').value;
      } else if (document.getElementById('both').checked) {
        timerValue = document.getElementById('both').value;
      }

      return {
        cupType: document.getElementById('cup_type').value,
        surface: document.getElementById('surface').value,
        milk: document.getElementById('milk').value,
        milkAmount: document.getElementById('milk_amount').value,
        roomTemp: document.getElementById('room_temp').value,
        darkness: document.getElementById('darkness').value,
        timer: timerValue
      }
    },

    brewTimer: function(time, mlkAmount) {
      let talking, percentage, brewDisplay, ms, bar;
      talking = document.getElementById('talking');
      brewDisplay = document.getElementById('brew_display');
      bar = document.getElementById('bar1');
      percent = 0;
      ms = time * 10;
      brewCount = setInterval(frame, ms);
      brewDisplay.innerHTML = `Brewing... ${percent}% ready`;
      // function frame peforms each interval
      function frame() {
        percent++;
        if (percent == 100) {
          brewDisplay.innerHTML = `Drink Up! ${percent}% ready`;
          timer = 'brew';
          clearInterval(brewCount);
          ready();
        } else {
          brewDisplay.innerHTML = `Brewing... ${percent}% ready`;
        }
      };
    },

    coldTimer: function(time) {
      let displayTime = formatTime(time);
      coldDisplay = document.getElementById('cold_display');
      coldDisplay.innerHTML = `It'll start getting cold in ${displayTime}`;
      coldCount = setInterval(coldCountDown, 1000);
      function coldCountDown() {
        time--;
        displayTime = formatTime(time);
        coldDisplay.innerHTML = `It'll start getting cold in ${displayTime}`;
        if (time === 0) {
          timer = 'cold';
          clearInterval(coldCount);
          ready();
        }
      };
    },

    progressBarWidth: function(wrapper) {
      document.getElementById(wrapper).style.width = '100%';
      displayProgressBars();
    },

    progressBarWidthBoth: function(brew, cold) {
      displayProgressBars();
      document.getElementById('brew_wrapper').style.width = `${(brew / cold) * 100}%`;
      document.getElementById('cold_wrapper').style.width = `${100 - (brew / cold) * 100}%`;
    },

    progressBarAnimate: function(time, divId) {
      let width, timeInMs;
      width = document.getElementById(divId).offsetWidth;
      timeInMs = time * 1000;
      animation = document.querySelector('.bar').animate({
        width: ['0px', `${width}px`]
      }, timeInMs)
    },

    progressBarAnimateBoth: function(time) {
      let timeInMs;
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

    enableTimerBtn: function() {
      document.getElementById('reset').disabled = true;
      document.getElementById('set_timer').disabled = false;
    },

    disableTimerBtn: function() {
      document.getElementById('reset').disabled = false;
      document.getElementById('set_timer').disabled = true;
    },

    openInstructions: function() {
      document.getElementById('instructions_modal').style.display = 'block';
    },

    closeInstructions: function() {
      document.getElementById('instructions_modal').style.display = 'none';
    },

    toggleSound: function() {
      audio = !audio;
      console.log(audio);
    }

  }

})();


////////////////////////////////////////////////////////////////////////////////// Global Controller


const controller = (function(dataCtrl, UICtrl) {
  let input = {}
	let timeBrew, timeCold, brewObj, coldObj;

  const setupEventListeners = function() {
    let optionsArr;
    //The Nodelist (option) is borrowing/calling the Array slice method
    optionsArr = Array.prototype.slice.call(document.getElementsByClassName('option'));
    // loops through optionsArr (array)
    optionsArr.forEach(function(element) {
      element.addEventListener('click', changeImage);
    });
    document.getElementById('set_timer').addEventListener('click', setTimers);
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('instructions_btn').addEventListener('click', UICtrl.openInstructions);
    document.getElementsByClassName("close")[0].addEventListener('click', UICtrl.closeInstructions);
    document.getElementById('un_mute').addEventListener('click', UICtrl.toggleSound);
  };

  const changeImage = function() {
    // Get field data
    inputData();
    // Display new image according to input object
    UICtrl.adjustImage(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.darkness)
  };

  const setTimers = function() {
    // Disable/ enable button
    UICtrl.disableTimerBtn();
    // Get field data. Input variable will be an object with choices selected
    inputData();

    if (input.timer === 'brew') {
      // Get time data according to variables
      addVariables('brew');
      // Calculate times
      timeBrew = dataCtrl.calcTimer(brewObj);
      console.log(`Brew time ${timeBrew} secs`);
      // Start and display first timer progress and alert when complete
      UICtrl.progressBarWidth('brew_wrapper');
      UICtrl.brewTimer(timeBrew, input.milkAmount);
      UICtrl.progressBarAnimate(timeBrew, 'brew_wrapper');

    } else if (input.timer === 'cold') {
      addVariables('cold');
      timeCold = dataCtrl.calcTimer(coldObj);
      UICtrl.progressBarWidth('cold_wrapper');
      UICtrl.coldTimer(timeCold);
      UICtrl.progressBarAnimate(timeCold, 'cold_wrapper');

    } else if (input.timer === 'both') {
      addVariables('brew');
      addVariables('cold');
      timeBrew = dataCtrl.calcTimer(brewObj);
      timeCold = dataCtrl.calcTimer(coldObj);
      console.log(`Brew time ${timeBrew} secs`);
      UICtrl.progressBarWidthBoth(timeBrew, timeCold)
      UICtrl.brewTimer(timeBrew, input.milkAmount);
      UICtrl.coldTimer(timeCold);
      UICtrl.progressBarAnimateBoth(timeCold);
    }
  };

  const reset = function() {
    UICtrl.enableTimerBtn();
    UICtrl.reset();
  };

  const inputData = function() {
    // Input variable is object according to choices
    input = UICtrl.getInput();
  };

  const addVariables = function(timer) {
    if (timer === 'brew') {
      brewObj = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.darkness, input.timer, 0);
    } else if (timer === 'cold') {
      coldObj = dataCtrl.addVariables(input.cupType, input.surface, input.milk, input.milkAmount, input.roomTemp, input.darkness, input.timer, 1);
    }
  };

  return {
    init: function() {
      setupEventListeners();
      changeImage();
      UICtrl.enableTimerBtn();
    }
  };

})(dataController, UIController);
controller.init();
