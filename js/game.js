function makeGame() {
    console.log("Game object created");
    
    //variables
    const NUMBER_OF_SQUARES = 24;
    const GAMEPLAY_TIME_IN_SECONDS = 30;
    let gameDifficulty = 2; //TODO Enum
    let level = 1;
    let sortedArray = generateRandomArray(level);
    let shuffledArray = shuffleArray(sortedArray.slice(0));   
    let correctAnswers = 0;
    let multiplier = 1; //add comment
    let score = 0;
    let highScore = 0;
    let timeLeft = 0;

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
        console.log("Game initialized");
    }

    function startGame(){
        startButton.style.visibility = "hidden";
        messageDisplay.textContent = "First number is " + sortedArray[0];
        //delay 3 sekundy, wyswietl wiadomosc jaka ma byc pierwsza liczba
        startTimer(GAMEPLAY_TIME_IN_SECONDS);
        drawSquares();
    }

    function gameWon(){
        //jezeli lvl 5 to zablokuj gre, podziekuj i nara
        score += timeLeft*gameDifficulty*5;
        showScoreOnScreen();
        resetGame();
        setLevel(++level);
        messageDisplay.textContent = "Congrats, next level";
        console.log("Moving to the next level");   
    }

    function gameLost(){
        resetGame();
        setLevel(1);
        saveBestScore();
        resetScore();
        console.log("Moving to the first level");
    }

    function changeGameDifficulty(difficulty){
        saveBestScore();
        resetScore();
        gameDifficulty = difficulty;
        messageDisplay.textContent = "Mode switched";
    }

    function resetGame(){
        cleanBoard();
        generateNewFilledArrays();
        clearInterval(timeLeft);
        correctAnswers = 0;
        timeBarText.textContent = "";
        startButton.style.visibility = "visible";  
    }

    function cleanBoard(){
        for (let i = 0; i < squares.length; i++) {
            squares[i].style.visibility="visible";
            squares[i].textContent="";
        }
    }

    function drawSquares(){
        for (let i = 0; i < squares.length; i++) {
            squares[i].textContent = shuffledArray[i];
        }
    }

    function showGameStatus(){
        console.log("Numbers array: " + shuffledArray);
        console.log("Sorted numbers array: " + sortedArray);
        console.log("Game level: " + level);
        console.log("Game mode: " + gameDifficulty);
        console.log("Multiplier: " + multiplier);
    }

    function addScore(){
        score += multiplier*gameDifficulty*5;
        showScoreOnScreen();
    }
    
    //add to cookies
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

    function startTimer(seconds){
        showTime();
        timeLeft = setInterval(showTime, 1000);

        function showTime(){
            if(timeBarText.textContent === "1"){
                gameLost();
                messageDisplay.textContent = "Time is over";
                clearInterval(timeLeft);
            }
            else{
                timeBarText.textContent = seconds;
                seconds--;
            }
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
            startGame();
        }else{
            messageDisplay.textContent = "You clicked " + square.textContent + " but there was " + sortedArray[0];
            gameLost();  
        }

        if(correctAnswers === NUMBER_OF_SQUARES){
            gameWon();
        }
    }

    function setupEventListeners(){
        //Square event listeners
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", function(){
                onSquarePressed(this);
            })
        }

        //Start game button
        startButton.addEventListener("click", function(){
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