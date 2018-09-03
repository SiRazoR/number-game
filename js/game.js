function makeGame() {
    console.log("Game object created");
    
    //variables
    const NUMBER_OF_SQUARES = 24;
    const GAMEPLAY_TIME_IN_SECONDS = 35;
    let gameDifficulty = 1; //TODO Enum
    let multiplier = 1; //To calculate score
    let level = 1;
    let sortedArray = generateRandomArray(level);
    let shuffledArray = shuffleArray(sortedArray.slice(0));   
    let correctAnswers = 0;
    let userClickOnEmptySquare = 0; 
    let score = 0;
    let highScore = 0;
    let secondsLeft = 0;
    let timerInterval = 0;
    let timerBarInterval = 0;

    //html elements
    let difficultyButtons = document.querySelectorAll(".mode");
    let startButton = document.querySelector("#start");
    let messageDisplay = document.querySelector("#message");
    let levelDisplay = document.querySelectorAll(".level");
    let timeBarText = document.querySelector("#timeBarText");
    let timeBar = document.querySelector("#myBar");
    let squares = document.querySelectorAll(".square");
    let currentScore = document.querySelector("#currentScore");
    let highestScore = document.querySelector("#highestScore"); 

    function init(){
        setupEventListeners();
        setLevel(1);
    }

    //MAIN FUNCTIONALITY SECTION
    //-----------------------------------------------------------------------
    function sleep (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    function startGame(){
        startButton.style.visibility = "hidden";
        messageDisplay.textContent = "Your first number will be " + sortedArray[0];
        timeBarText.textContent = "Game starts in 3 seconds";
        
        sleep(3000).then(() => {
            startTimer(GAMEPLAY_TIME_IN_SECONDS);
            drawSquares();
            messageDisplay.textContent = "";
        });       
    }

    function gameLost(){
        resetGame();
        setLevel(1);
        saveBestScore();
        resetScore();
        console.log("Moving to the first level");
    }
    
    function gameWon(){
        if(level === 5) {
            endOfTheGame()
        }else{
        score += secondsLeft*gameDifficulty*5;
        showScoreOnScreen();
        resetGame();
        setLevel(++level);
        messageDisplay.textContent = "Congrats, ready for the next level?";
        console.log("Moving to the next level");    
        }
          
    }

    function endOfTheGame(){
        messageDisplay.textContent = "You have reached the end of the game";
        saveBestScore();
        resetScore();
        showScoreOnScreen();
        setLevel(1);
    }

    function changeGameDifficulty(difficulty){
        saveBestScore();
        resetScore();
        gameDifficulty = difficulty;
        messageDisplay.textContent = "Mode switched";
    }

    function resetGame(){
        userClickOnEmptySquare = 0;
        cleanBoard();
        generateNewFilledArrays();
        resetTimers();
        correctAnswers = 0;
        startButton.style.visibility = "visible";  
    }

    function cleanBoard(){
        for (let i = 0; i < squares.length; i++) {
            squares[i].style.visibility="visible";
            squares[i].textContent="";
        }
    }

    function showGameStatus(){
        console.log("Numbers array: " + shuffledArray);
        console.log("Sorted numbers array: " + sortedArray);
        console.log("Game level: " + level);
        console.log("Game difficulty: " + gameDifficulty);
        console.log("Multiplier: " + multiplier);
        console.log("Score: " + score);
        console.log("HighScore: " + highScore);
    }


    //SCORE SECTION
    //-----------------------------------------------------------------------
    function addScore(){
        score += multiplier*gameDifficulty*5;
        showScoreOnScreen();
    }
    
    function saveBestScore(){
        if(score > highScore){ 
            highScore = score; 
            highestScore.textContent = "Best score: " + highScore;
        }
    }
    
    function resetScore(){
        score = 0;
        showScoreOnScreen();
    }
    
    function showScoreOnScreen(){
        currentScore.textContent = "Score: " + score;
    }

    //TIMER SECTION
    //-----------------------------------------------------------------------
    function resetTimers(){
        clearInterval(timerInterval);
        timeBarText.textContent = "";
        clearInterval(timerBarInterval);
        timeBar.style.width = '0%';
    }

    function startTimer(seconds){
        drawTimerBar();
        displayTime(seconds);
        timerInterval = setInterval(displayTime, 1000);

        function displayTime(){
            if(timeBarText.textContent === "1s"){
                gameLost();
                messageDisplay.textContent = "Time is over";
            }
            else{
                secondsLeft = seconds;
                timeBarText.textContent = seconds + "s";
                seconds--;
            }
        }
    }

    function drawTimerBar(){
        var width = 0;
        let gameplayInMiliseconds = GAMEPLAY_TIME_IN_SECONDS *10;
        let intervalsInMiliseconds = 100;
        timerBarInterval = setInterval(drawTimeBar, intervalsInMiliseconds);
        function drawTimeBar() {
            if (width >= 100) {
            } else {
            width+=intervalsInMiliseconds/gameplayInMiliseconds; 
            timeBar.style.width = width + '%'; 
            }
        }
        }
    
    //LEVEL SECTION
    //-----------------------------------------------------------------------
    function setLevel(lvl){
        //new multiplier
        multiplier = (lvl * 0.2 + 0.8).toFixed(1);

        level = lvl;
        //If someone lose it is nessesairy to reset colors
        for (let i = 0; i < 5; i++) {
            levelDisplay[i].classList.remove("completedLevel");
        }
        //setting next level as completed
        for (let i = 0; i < level; i++) {
            levelDisplay[i].classList.add("completedLevel");
        }
    }
    
    //ARRAYS SECTION
    //-----------------------------------------------------------------------
    function generateNewFilledArrays(){
        sortedArray = generateRandomArray();
        shuffledArray = shuffleArray(sortedArray.slice(0));
    }

    function generateRandomArray(){ 
        //random by level does not work
        //dopisz funkcjonalnosc losowania cyfrr wzgledem lvli
        let squareValue = Math.floor(Math.random()*50+1);
        let array = [];
        
        for(let i=0; i<NUMBER_OF_SQUARES ; i++){
            array[i] = squareValue;
            squareValue += gameDifficulty;
        }
        return array;
    }
    
    function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    return arr;
    }


    //SQUARE SECTION
    //-----------------------------------------------------------------------
    function drawSquares(){
        for (let i = 0; i < squares.length; i++) {
            squares[i].textContent = shuffledArray[i];
        }
    }

    function onSquarePressed(square){
        let clickedSquare = square.textContent;
        if(clickedSquare == sortedArray[0]){
            square.style.visibility="hidden";
            sortedArray.splice(0,1);//add comment
            correctAnswers++;
            addScore();
        }else if(clickedSquare == ""){ 
            //if user pressed empty square several times before game starts, 
            //startGame() were called more than once 
            //this if() prevents user to call startGame more than once
            console.log("userClickOnEmptySquare" + userClickOnEmptySquare);
            if (userClickOnEmptySquare<1) {
                console.log("start game");
                startGame();
            }
            
            ++userClickOnEmptySquare;
            console.log("userClickOnEmptySquare after start" + userClickOnEmptySquare);
        }else{
            messageDisplay.textContent = "You clicked " + square.textContent + " but there was " + sortedArray[0];
            gameLost();  
        }

        if(correctAnswers === NUMBER_OF_SQUARES){
            gameWon();
        }
    }

    //EVENT LISTENERS
    //-----------------------------------------------------------------------
    function setupEventListeners(){
        //Square event listeners
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", function(){
                onSquarePressed(this);
            })
        }

        //Start game button
        startButton.addEventListener("click", function(){
           ++userClickOnEmptySquare;
           startGame();
        });

        //difficulty buttons listeners
        for (let buttonNumber = 0; buttonNumber < difficultyButtons.length; buttonNumber++) {
            difficultyButtons[buttonNumber].addEventListener("click", function(){
                difficultyButtons[0].classList.remove("selected");
                difficultyButtons[1].classList.remove("selected");
                difficultyButtons[2].classList.remove("selected");
                this.classList.add("selected");
                setLevel(1);
                changeGameDifficulty(buttonNumber+1);//because buttonNumber starts from 0
                resetGame();
            });
        }
    }

    return {
      init,
      showGameStatus,
      resetGame,
      gameWon,
      //clean high score from cookies
    };
  }