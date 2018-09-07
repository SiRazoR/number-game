console.log("Script loaded")
const game = makeGame();
game.init();
console.log("You can use: ");
console.log("game.showGameStatus() - will show all important variables");
console.log("game.resetGame() - will reset board");
console.log("game.gameWon() - will move to the next level");

// To hide browser address bar on mobile
window.addEventListener("load",function() {
    setTimeout(function(){
        window.scrollTo(0, 1);
    }, 0);
});