function makeGame() {
    console.log("Game object created");
    
    //variables
    let gameMode = 2;
    let level = 1;
    let sortedNumbersArray = randomArray(level);
    let numbersArray = shuffleArray(sortedNumbersArray.slice(0));   
    let correctNumbers = 0;
    let timerInterval;
    let clickedNumbers;

    //html elements
    let modeButtons = document.querySelectorAll(".mode");
    let startButton = document.querySelector("#start");
    let messageDisplay = document.querySelector("#message");
    let levelDisplay = document.querySelectorAll(".level");
    let timeBarText = document.querySelector("#timeBarText");
    let timeBar = document.querySelector("#myBar");
    let squares = document.querySelectorAll(".square");
    let currentScore = document.querySelector("#currentScore");
    let bestScore = document.querySelector("#bestScore");
    

    function init(){
        setupEventListeners();
        setLevel(1);
        console.log("Game initialized");
    }

    function startGame(){
        startButton.style.visibility = "hidden";
        messageDisplay.textContent = "First number is " + sortedNumbersArray[0];
        startTimer(10);//for now let it be 10 sec
        drawSquares();
    }

    function youWon(){
        reset();
        setLevel(++level);
        messageDisplay.textContent = "Congrats, next level";
        console.log("Moving to the next level");   
    }

    function youLost(){
        reset();
        setLevel(1); 
        console.log("Moving to first level");
    }

    function changeGameplayMode(mode){
        gameMode = mode;
        messageDisplay.textContent = "Mode switched";
    }

    function reset(){
        cleanBoard();
        generateNewFilledArray();
        clearInterval(timerInterval);
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
            squares[i].textContent = numbersArray[i];
        }
    }

    function showGameStatus(){
        console.log("Numbers array: " + numbersArray);
        console.log("Sorted numbers array: " + sortedNumbersArray);
        console.log("Game level: " + level);
        console.log("Game mode: " + gameMode);
    }

    function setLevel(lvl){
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
    
    function generateNewFilledArray(){
        sortedNumbersArray = randomArray(level);
        numbersArray = shuffleArray(sortedNumbersArray.slice(0));
    }

    function randomArray(level){ //random by level does not work
        let arrayStartPoint = Math.floor(Math.random()*50+1);
        let array = [];
        
        for(let i=0; i<24 ; i++){
            array[i] = arrayStartPoint;
            arrayStartPoint += gameMode;
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
        draw();
        timerInterval = setInterval(draw, 1000);

        function draw(){
            if(timeBarText.textContent === "1"){
                timeBarText.textContent = "";
                youLost();
                messageDisplay.textContent = "Time is over";
                clearInterval(timerInterval);
            }
            else{
                timeBarText.textContent = seconds;
                seconds--;
            }
        }
    }

    //function addscore(level)
    //calculate score depending on the level
    //show score on screen

    //function saveBestScore()
    //add to cookies
    //show on page

    function clickedSquare(square){
        let clickedSquare = square.textContent;
        if(clickedSquare == sortedNumbersArray[0]){
            square.style.visibility="hidden";
            sortedNumbersArray.splice(0,1);
            correctNumbers++;
            //addscore
        }
        else if(clickedSquare == ""){  
            messageDisplay.textContent = "Please start game first";
        }
        else{
            messageDisplay.textContent = "You clicked " + square.textContent + " but there was " + sortedNumbersArray[0];
            youLost();  
        }

        if(correctNumbers === 24){
            youWon();
        }
    }

    function setupEventListeners(){
        //square event listeners
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", function(){
                clickedSquare(this);
            })
        }

        //Start game
        startButton.addEventListener("click", function(){
           startGame();
        });

        //mode buttons listeners
        for (let buttonNumber = 0; buttonNumber < modeButtons.length; buttonNumber++) {
            modeButtons[buttonNumber].addEventListener("click", function(){
                modeButtons[0].classList.remove("selected");
                modeButtons[1].classList.remove("selected");
                modeButtons[2].classList.remove("selected");
                this.classList.add("selected");
                setLevel(1);
                changeGameplayMode(buttonNumber+1);//because buttonNumber starts from 0
                reset();
            });
        }
    }

    return {
      init,
      showGameStatus,
      reset,
      youWon,
      //clean high score from cookies
    };
  }