document.addEventListener('DOMContentLoaded', function () {
  let timerDisplay = document.getElementById('timer-tag');
  let startButton = document.getElementById('start-btn');
  let addTaskButton = document.getElementById('add-task-btn');
  let tomato = 0.1;
  let timeLeft = tomato * 60;
  let timerRunning = false;
  let timerInterval;
  let fineButton = document.getElementById('fineButton');
  let breakButton = document.getElementById('breakButton');
  const audio = new Audio('assets/sound/alarm.mp3');
  let task = document.getElementById('task');
  let lapCounts = document.getElementById('laps-count');
  let incrementPomos = document.getElementById('increment-pomos');
  let decrementPomos = document.getElementById('decrement-pomos');
  let taskContainer = document.getElementById('task-container');
  let lapsContainer = document.getElementById('laps-container');
  let lapsValues = 0;
  let youtubeContainer = document.getElementById('youtube-container');
  let deleteYoutubeLink = document.getElementById('delete-youtube-link');
  let randomSongButton = document.getElementById('random-song-button');
  let aboveDeleteTaskContainer = document.getElementById('above-delete-todo-button');
  let displayTodoList = document.getElementById('display-todo-list');
  displayTodoList.style.display = "block";
  let todoContainer = document.getElementById('todo-container');
  let pomotaskerFooterTitle = document.getElementById('pomotasker-footer-title');
  let d = new Date();
  pomotaskerFooterTitle.textContent = " Pomotasker " + d.getFullYear();

  /*
  1. display_todo_list_dynamically() - This function is used for to display stored todo by 
                                      fetch from the session storage and added on the table dynamically.
  */
  function display_todo_list_dynamically() {
    var displayTodoList = document.getElementById('display-todo-list')
    displayTodoList.innerHTML = '';
    var id = sessionStorage.getItem('id')

    var table = document.createElement('table');

    for (let index = 1; index <= id; index++) {
      var data = JSON.parse(sessionStorage.getItem('todo-' + index))

      console.log(data)
      if (data) {
        var row = table.insertRow(-1);

        var checkCell = row.insertCell(0);
        var todoCell = row.insertCell(1);
        // var dateCell = row.insertCell(2);
        var actionCell = row.insertCell(2);

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = index;
        checkbox.onchange = function () {
          check_todo(index);
        };

        checkCell.appendChild(checkbox);
        todoCell.innerHTML = data.todo;
        // dateCell.innerHTML = data.date;
        var checkFlag = data.checkFlag;

        if (index === checkFlag) {
          todoCell.style = "text-decoration:line-through";
          checkbox.checked = true;
        }
        actionCell.innerHTML = `<button id='delete-${index}' class='delete-todo-button' onclick='delete_todo(${index}) || display_todo_list()' style='background-color: white'><i class="fa-solid fa-trash"></i></button>`;
      }
    }
    displayTodoList.appendChild(table);
  }

  // used to check mytask sesstion is active or not.
  let mytaskSesstion = sessionStorage.getItem('mytask');
  if (mytaskSesstion != null) {
    taskContainer.style = "display: block";
    aboveDeleteTaskContainer.style = "display: block;";
    taskContainer.textContent = mytaskSesstion;
  }

  /*
  2. isAnyTaskOrVideoLinkInSession() - This function is used to check both todo keys sesstion and
                                      videos inside sesstion.
  */
  function isAnyTaskOrVideoLinkInSession() {
    return isAnyTodoKeyInSession() || isAnyVideoLinkKeyInSession();
  }

  /*3. display_both_container() - This function is used to display both container which is todo container or 
                                  video container.
  */
  function display_both_container() {
    if (isAnyTaskOrVideoLinkInSession()) {
      document.querySelector('.both-container-fix').style.display = "block";
    } else {
      document.querySelector('.both-container-fix').style.display = "none";
    }
  }
  // calling this function
  display_both_container();

  /*
  4. isAnyTodoKeyInSession() - used to check session consist the sesstion of 'todo-' key.
  */
  function isAnyTodoKeyInSession() {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("todo-")) {
        todoContainer.style = "display: block";
        return true;
      }
    }
    return false;
  }

  /*
  5. isAnyLapsKeyInSession() - used to check session consist the sesstion of 'laps' key.
  */
  function isAnyLapsKeyInSession() {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("laps")) {
        return true;
      }
    }
    return false;
  }

  /*
  6. isLapsEnded() - This function is used to check user enterd laps and clock laps are equal or not. 
  */
  function isLapsEnded() {
    if (sessionStorage.getItem("tomatoLaps") == sessionStorage.getItem("laps")) {
      return true;
    }
    return false;
  }

  /*
  7. isAnyTomatoLapsKeyInSession() - used to check session consist the sesstion of 'tomatoLaps' key.
  */
  function isAnyTomatoLapsKeyInSession() {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("tomatoLaps")) {
        return true;
      }
    }
    return false;
  }

  if (!isAnyTomatoLapsKeyInSession()) {
    sessionStorage.setItem("tomatoLaps", 0);
  }

  if (isAnyLapsKeyInSession()) {
    let lapVal = sessionStorage.getItem("laps");
    lapsContainer.textContent = sessionStorage.getItem("tomatoLaps") + " / " + sessionStorage.getItem("laps");
  }

  function checkTodoAvailable() {
    if (isAnyTodoKeyInSession()) {
      todoContainer.style = "display: block";
      return true;
    }
  }

  checkTodoAvailable();

  function isAnyVideoLinkKeyInSession() {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("videoLink")) {
        return true;
      }
    }
    return false;
  }

  if (isAnyVideoLinkKeyInSession()) {
    let sesstionVideo = sessionStorage.getItem('videoLink');
    if (sesstionVideo != null) {
      youtubeContainer.src = sesstionVideo;
    }
    else {
      youtubeContainer.style = "display: none";
      deleteYoutubeLink.style = "display: none";
      randomSongButton.style = "display: none";
    }

    youtubeContainer.style = "display: block";
    deleteYoutubeLink.style = "display: block";
    randomSongButton.style = "display: block";

  }


  deleteYoutubeLink.addEventListener('click', function () {
    if (isAnyVideoLinkKeyInSession()) {
      let sesstionVideo = sessionStorage.getItem('videoLink');
      if (sesstionVideo != null) {
        sessionStorage.removeItem('videoLink');
        youtubeContainer.style = "display: none";
        deleteYoutubeLink.style = "display: none";
        randomSongButton.style = "display: none";
        if (!isAnyTaskOrVideoLinkInSession()) {
          document.querySelector('.both-container-fix').style = "display: none";
        }
      }
    }
  });

  aboveDeleteTaskContainer.addEventListener('click', function () {
    if (taskContainer != null) {
      taskContainer.style.display = "none";
      aboveDeleteTaskContainer.style.display = "none";
      sessionStorage.removeItem('mytask');
    }
  });


  function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${minutes}:${seconds}`;
    document.title = `${minutes}:${seconds}` + " Time to grind!"
  }

  window.onload = function () {
    display_todo_list_dynamically();
    const storedTimerState = localStorage.getItem('timerState');
    if (storedTimerState === 'running') {
      timerRunning = true;
      timeLeft = parseInt(localStorage.getItem('timeLeft')) || 0;
      setInterval(countdown, 1000);
    }
  };


  window.addEventListener('beforeunload', function (event) {
    if (timerRunning) {
      const confirmationMessage = 'Timer is running. Are you sure you want to leave?';
      event.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  });


  function doSpark() {
    for (i = 0; i < 100; i++) {
      // Random rotation
      var randomRotation = Math.floor(Math.random() * 360);
      // Random Scale
      var randomScale = Math.random() * 1;
      // Random width & height between 0 and viewport
      var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
      var randomHeight = Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 500));
      // Random animation-delay
      var randomAnimationDelay = Math.floor(Math.random() * 15);
      console.log(randomAnimationDelay);
      // Random colors
      var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
      var randomColor = colors[Math.floor(Math.random() * colors.length)];
      // Create confetti piece
      var confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.top = randomHeight + 'px';
      confetti.style.right = randomWidth + 'px';
      confetti.style.backgroundColor = randomColor;
      // confetti.style.transform='scale(' + randomScale + ')';
      confetti.style.obacity = randomScale;
      confetti.style.transform = 'skew(15deg) rotate(' + randomRotation + 'deg)';
      confetti.style.animationDelay = randomAnimationDelay + 's';
      document.getElementById("confetti-wrapper").appendChild(confetti);
    }
  }

  function lapsAreEnded() {
    if (isLapsEnded()) {
      alert("Congratulation you completed your all laps !");
      document.getElementById('wrapper-spark').style.display = "block";
      sessionStorage.setItem("tomatoLaps", 0);
      sessionStorage.removeItem("laps");
      doSpark();
      setTimeout(function () {
        document.getElementById('wrapper-spark').style.display = "none";
        window.location.reload();
      }, 10000);
    }
  }

  fineButton.addEventListener('click', function () {
    document.getElementById('popup-timer').style.display = 'none';
    lapsAreEnded();
    document.title = "PomoTasker - Stay productive!";
    resetTimer(tomato);
    saveTimerState();
  });

  breakButton.addEventListener('click', function () {
    document.getElementById('popup-timer').style.display = 'none';
    lapsAreEnded();
  });

  function countdown() {
    updateTimer();

    if (timeLeft > 0 && timerRunning) {
      timeLeft--;
    } else {
      audio.play();
      if (isAnyTomatoLapsKeyInSession() && isAnyLapsKeyInSession()) {
        let sessionTomatoLaps = parseInt(sessionStorage.getItem("tomatoLaps")) || 0;
        sessionTomatoLaps++;
        sessionStorage.setItem("tomatoLaps", sessionTomatoLaps);
        lapsContainer.textContent = sessionStorage.getItem("tomatoLaps") + " / " + sessionStorage.getItem("laps");
      }
      document.getElementById('popup-timer').style.display = 'block';
      document.title = "PomoTasker - Timer has ended!";
      resetTimer(tomato);
    }
  }

  function startTimer() {
    timerInterval = setInterval(countdown, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer(time) {
    clearInterval(timerInterval);
    timerDisplay.textContent = `${time}:00`;
    timeLeft = time * 60;
    timerRunning = false;
    startButton.textContent = 'Start';
  }

  startButton.addEventListener('click', function () {
    timerRunning = !timerRunning;
    if (timerRunning) {
      startButton.textContent = 'Pause';
      startTimer();
    } else {
      startButton.textContent = 'Start';
      pauseTimer();
    }
  });

  // timer ended

  const lofiSongs = [
    "https://www.youtube.com/watch?v=CIaTR6UYMO0",
    "https://www.youtube.com/watch?v=YFiAnTsAnmw",
    "https://www.youtube.com/watch?v=jsrqNCYuxsI",
    "https://www.youtube.com/watch?v=tJbDzPo9wWE"
  ];

  randomSongButton.addEventListener('click', function () {
    let randomLofiSong = lofiSongs[Math.floor(Math.random() * lofiSongs.length)];

    let getVideoId = getYouTubeVideoId(randomLofiSong);
    let videoLink = "https://www.youtube.com/embed/" + getVideoId;
    sessionStorage.setItem('videoLink', videoLink);
    add_link_to_video(getVideoId);
  });

  function add_link_to_video(vId) {
    let videoLink = "https://www.youtube.com/embed/" + vId;
    sessionStorage.setItem('videoLink', videoLink);
    youtubeContainer.src = videoLink;
    youtubeContainer.style = "display: block";
    deleteYoutubeLink.style = "display: block";
    randomSongButton.style = "display: block";
  }


  addTaskButton.addEventListener('click', function () {
    let youtubeLink = document.getElementById('youtube-link');
    let taskValue = task.value;
    if (taskValue.trim() !== '') {
      taskContainer.textContent = taskValue;
      sessionStorage.setItem("mytask", task.value);
      taskContainer.style = "display: block;";
      todoContainer.style.display = "block";
      aboveDeleteTaskContainer.style = "display: block;";
      task.value = '';
    }
    lapsContainer.style = "display: block;";
    lapsValues = lapCounts.value;
    sessionStorage.setItem("laps", lapsValues);
    if (isAnyLapsKeyInSession()) {
      lapsContainer.textContent = `${sessionStorage.getItem("tomatoLaps")} / ${sessionStorage.getItem("laps")}`;
      lapCounts.value = '';
    }
    let videoId = getYouTubeVideoId(youtubeLink.value);
    if (videoId) {
      // Valid YouTube link, set the src attribute
      add_link_to_video(videoId);
      youtubeContainer.style = "display: block";
      deleteYoutubeLink.style = "display: block";
      randomSongButton.style = "display: block";
    } else {
      // Invalid YouTube link, hide the container
      youtubeContainer.style = "display: none;";
    } lapCounts
    window.location.href = "#";
    window.location.reload();
  });

  function getYouTubeVideoId(url) {
    var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    var match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }

  incrementPomos.addEventListener('click', function () {
    // Parse the current value and increment it
    var currentValue = parseInt(lapCounts.value, 10) || 0;
    if (currentValue < 20) {
      lapCounts.value = currentValue + 1;
    }
  });

  decrementPomos.addEventListener('click', function () {
    // Parse the current value and decrement it, but ensure it doesn't go below 0
    var currentValue = parseInt(lapCounts.value, 10) || 1;
    lapCounts.value = currentValue > 1 ? currentValue - 1 : 1;
  });

  let addTodo = document.getElementById('add-button');
  let todoAddedMessage = document.querySelector('.todo-added-message');
  let todoInput = document.getElementById('todo-input');

  addTodo.addEventListener('click', function () {
    let todoValue = todoInput.value;
    if (todoValue.trim() !== '') {
      taskContainer.style = "display: block;";
      todoContainer.style.display = "block";
      display_todo_list_dynamically();
      // Display the "Todo added" message
      todoAddedMessage.style.display = "block";
      todoInput.value = null;
      // Hide the message after 2000 milliseconds (2 seconds)
      setTimeout(function () {
        todoAddedMessage.style.display = "none";
      }, 2000);
    }
  });

});