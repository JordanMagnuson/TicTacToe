var app = app || {};

$(document).ready(function() {
    gameBoard = setUpBoard();
    $('.game_options td').click(function(e) {
        if (app.gameOptionsAlreadyclicked === false) { //prevents a rare bug if gameoptions is dblclicked
            difficulty = e.target.id; //find the child of the clicked parent
            who_starts();
            gameLoadAnimation();
            setupScoreBoard();
            app.gameOptionsAlreadyclicked = true;
            console.log("Loading " + difficulty + " computer");
        }
    });

    $(".game_table").click(function(e) {
        var IDOfCellClicked = e.target.id;
        playerMove(IDOfCellClicked);
    });

    $('#play_again').click(function() {
        clearBoard();
    });

    $('#home').click(function() {
        location.reload();
    });
});


app.turn = 1;
app.round = 1;
app.player1Score = 0;
app.player2Score = 0;
app.isRoundInProgress = true;
app.gameOptionsAlreadyclicked = false;
//App is designed to allow 'class' type variables to minimise the need for unnecessary parameter passing.

function gameLoadAnimation() {

    //This displays all the elements via a fadeIn effect.
    $('.game_control').fadeOut(200);

    var countDownFrom = 5;
    var countDown = setInterval(function(){
    $('#play5').text(countDownFrom + "...").fadeIn(500).fadeOut(500);
    countDownFrom--;
    if (countDownFrom <= 0) {
        clearTimeout(countDown);
    }
    }, 1000);

    $('#play_lets').delay(200).fadeIn(500).delay(5360).fadeOut(500);
    $('#play_is').delay(6560).fadeIn(500).append(startingPlayer);
	$('#begun, #play_happening, .game_table, #home, #score').delay(6560).fadeIn(1500);
    var currentPlayerDiv = $('<div>').attr('id', 'whos_turn_is_it').text(currentPlayer + " It's your turn").fadeIn(100);
    $('.game_cell#3').prepend(currentPlayerDiv);
}


function playerMove(IDOfCellClicked) {
    if (app.isRoundInProgress === true) {
        // Play in the clicked cell as long as it hasn't been played in before
        if (gameBoard[IDOfCellClicked] === null) {
            gameBoard[IDOfCellClicked] = currentPlayer;
            $('#' + IDOfCellClicked).prepend(currentPlayer);
            app.turn++;
            if (checkForWin()) {
                if (difficulty === "AICheater") {
                     // Just some fun code for if the player manages to beat the cheating AI
                    for (var i = 0; i < 9; i++) {
                        gameBoard[i] = 'X';
                        $('#' + i).text('X').css('font-size', "45px").css('background-color', "red");
                        }
                        changePlayer();
                        roundWon();
                        alert("MUHAHAHAHA... YOU THINK YOU WIN????? WRONG I DO!");
                }
                else {
                    roundWon();
                }
            }
            else if (checkForDraw()){
                roundDrew();
            }
            else {
                changePlayer();
                //Player locked out from playing during delay for AI play
                app.isRoundInProgress = false;
                setTimeout(function() {
                app.isRoundInProgress = true;
                AIPlay();
            },  500); //AI move delayed by 500ms
            }
        }
    }
}

function setUpBoard() {
    var gameBoard = new Array(9);
    for (var i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = null;
    }
    return gameBoard;
}

function setupScoreBoard () {
    if (difficulty === "human") {
        $('#title_score1').text("Human 1 Score");
        $('#title_score2').text("Human 2 Score");
    }
    else {
        $('#title_score1').text("Computer Score");
        $('#title_score2').text("Human Score");
    }
}



function changePlayer() {
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
    } else {
        currentPlayer = 'X';
    }
    $('#whos_turn_is_it').text(currentPlayer + " It's your turn");
}


function who_starts() {
    var randomPlayer = Math.floor(Math.random() * 2 + 1);
    if (difficulty !== "human") {
        if (randomPlayer === 1) {
            startingPlayer = "The Computer of Doom! (X)";
            currentPlayer = 'X';
            AIPlay();
        } else {
            startingPlayer = "The Human! (O)";
            currentPlayer = 'O';
        }
    } else {
        if (randomPlayer === 1) {
            startingPlayer = "Human Number 1! (X)";
            currentPlayer = 'X';
        } else {
            startingPlayer = "Human Number 2! (O)";
            currentPlayer = 'O';
        }
    }
}


function changeStartingPlayer() {
	if (startingPlayer === "The Computer of Doom! (X)") {
	   startingPlayer = "The Human! (O)";
	   currentPlayer = 'O';
    }
    else if (startingPlayer === "The Human! (O)") {
        startingPlayer = "The Computer of Doom! (X)";
        currentPlayer = 'X';
	}
    else if (startingPlayer === "Human Number 1! (X)") {
        startingPlayer = "Human Number 2! (O)";
        currentPlayer = 'O';
    }
    else if (startingPlayer === "Human Number 2! (O)") {
        startingPlayer = "Human Number 1! (X)";
        currentPlayer = 'X';
    }
}


function clearBoard() {
    $('#won').empty();
    app.round++;
    app.turn = 0;
    app.isRoundInProgress = true;
	changeStartingPlayer();
	$('#play_again').fadeOut(1000);
	$('.game_table td').empty().css("background-color", "white"); //Clear the table visuals and cell highlighting
    $('#play_is').text(startingPlayer + " will start this round.");
    var currentPlayerDiv = $('<div>').attr('id', 'whos_turn_is_it').text(currentPlayer + " It's your turn").fadeIn(100);
    $('.game_cell#3').prepend(currentPlayerDiv);
    $('#begun').text("The game continues! Round " + app.round);
    if (currentPlayer === "X") {
        AIPlay();
    }
    for (var i = 0; i < 9; i++) {
        gameBoard[i] = null;
        $('#' + i).text('X').css('font-size', "25px"); // remove coloring on winning cells
    }
}


function checkForWin() {

    // check col win
    for (var i = 0; i < 3; i++) {
        if (gameBoard[i] === currentPlayer && gameBoard[i + 3] === currentPlayer && gameBoard[i + 6] === currentPlayer) {
            winningCells = [i, i+3, i+6]; //For coloring of winning cells
            return true;
        }
    }
    // check row win
    for (var j = 0; j < 9; j += 3) {
        if (gameBoard[j] === currentPlayer && gameBoard[j + 1] === currentPlayer && gameBoard[j + 2] === currentPlayer) {
            winningCells = [j, j+1, j+2];
            return true;
        }
    }
    // check diagonal win
    for (var k = 0; k <= 2; k += 2) {
        if (gameBoard[k] === currentPlayer && gameBoard[4] === currentPlayer && gameBoard[8 - k] === currentPlayer) {
            winningCells = [k, 4, 8-k];
            return true;
        }
    }
    return false;
}


function checkForDraw() {
    //if all elements are not null then unless a win, it must be a draw
	for (var i = 0; i < 9; i++) {
		if (gameBoard[i] === null) {
			return false;
		}
	}
	return true;
}


function roundDrew() {
    var wonDiv = $('<div>').attr('id', 'won').text("It's a draw!").fadeIn(100);
    $('.game_cell#5').append(wonDiv);
    endRound();
}


function roundWon() {
    updateScore();
    endRound();
    for (var i = 0; i < 3; i++) { //Look into using .each or similar rather than a for loop
        $("#" + winningCells[i]).css("background-color", "red");
    }
    console.log("winning cells where " + winningCells);
}


function endRound(){
    $('#whos_turn_is_it').fadeOut(0);
    app.isRoundInProgress = false;
    $('#play_again').fadeIn(1500);
}


function updateScore() {
    if (currentPlayer === 'X') {
        app.player1Score++;
        $('#score1').text(app.player1Score);
    } else if (currentPlayer === 'O') {
        app.player2Score++;
        $('#score2').text(app.player2Score);
    }
}

//BELOW HERE IS THE AI CODE

function AIPlay() {
    if (difficulty === "easy" && app.isRoundInProgress === true) {
        AIEasy();
    }
    else if (difficulty === "intermediate" && app.isRoundInProgress === true) {
        AIIntermediate();
    }
    else if (difficulty === "AIHardDefending" && app.isRoundInProgress === true) {
        AIHardDefending();
    }
    else if (difficulty === "AICheater" && app.isRoundInProgress === true) {
        AICheater();
    }
    app.turn++;
}


function isComputerAbleToWin () {
    //The computer plays in any open cell. It then checks if that cell will cause it to win.
    //If the cell will cause a win return the id of that cell.
    for (var x = 0; x < 9; x++) {
        if (gameBoard[x] === null) {
            gameBoard[x] = currentPlayer;
            if (checkForWin()) {
                $('#' + x).prepend(currentPlayer);
                return true;
            }
            else {
                gameBoard[x] = null;
            }
        }
    }
    return false;
}


function doesComputerNeedToBlock () {
    //The computer plays as the human in any open cell. It then checks if that cell will cause a human win.
    //If the cell will cause a human win return the id of that cell.
    for (var p = 0; p < 9; p++) {
        changePlayer();
        if (gameBoard[p] === null) {
            gameBoard[p] = currentPlayer;
            if (checkForWin()) {
                gameBoard[p] = null;
                humanAbleToWinAt = p;
                changePlayer();
                return true;
            }
            else {
                changePlayer();
                gameBoard[p] = null;
            }
        }
        else {
            changePlayer();
        }
    }
}


function playRandomly(){
    var findingFreeCell = true;
    while(findingFreeCell) { //while used as ending is uncertain
        var randomMove = Math.floor(Math.random() * 9);
        if (gameBoard[randomMove] === null) {
            gameBoard[randomMove] = currentPlayer;
            $('#' + randomMove).prepend(currentPlayer);
            findingFreeCell = false;
            if (checkForWin()) {
                roundWon();
            }
            else if (checkForDraw()){
                roundDrew();
            }
            changePlayer();
            console.log("Computer played randomly");
        }
    }
}


function getARandomOption(arrayOfOptions) {
  //This function is used to randomise a selection of possible moves for the AI
    for (var i = arrayOfOptions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arrayOfOptions[i];
        arrayOfOptions[i] = arrayOfOptions[j];
        arrayOfOptions[j] = temp;
    }
    return arrayOfOptions[0];
}



function AIEasy() {
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("Computer played to win");
    }
    else {
      playRandomly();
    }
}


function AIIntermediate() {
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("Computer played to win");
    }
    else if (doesComputerNeedToBlock()) {
        gameBoard[humanAbleToWinAt] = currentPlayer; // Updating the array
        $('#' + humanAbleToWinAt).prepend(currentPlayer);
        changePlayer();
        console.log("Computer played to block human win");
        if (checkForDraw()){ //In case computer draws whilist blocking human win
            roundDrew();
        }
    }
    else {
      playRandomly();
    }
}


function AICheater() {
    //This mode is just for a bit of fun. Hard coded lots of scenarios designed to make it rather
    //frustrating for the player! The computer often plays twice but tries or might just steal your piece!
    //It tries to cheat subtly and will often play twice if the player has a 2 win scenario.
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("computer played to win");
        return;
    }
    else if (doesComputerNeedToBlock()) {
        gameBoard[humanAbleToWinAt] = currentPlayer;
        $('#' + humanAbleToWinAt).text(currentPlayer);
        console.log("computer played to block human win");
        changePlayer();
    }
    else {
        playRandomly();
    }
    if (doesComputerNeedToBlock() && app.turn > 5) {
        //If after turn 5 the computer will block twice in a row if it needs to!
        changePlayer();
        gameBoard[humanAbleToWinAt] = 'X';
        $('#' + humanAbleToWinAt).text('X');
        console.log("The human is attempting a 2 way win - Computer cheated to block it");
        changePlayer();
    }
    else if (app.turn==6) {
        changePlayer();
        var possibilities = [0,1,2,3,4,5,6,7,8];
        var cheatingMove = getARandomOption(possibilities);
        gameBoard[cheatingMove] = 'X'; // Play a 2nd time. Steal the cell if taken
        $('#' + cheatingMove).text('X');
        console.log("computer cheated at " + cheatingMove);
        changePlayer();
        app.turn++;
    }
    else if (app.turn==5 && doesComputerNeedToBlock()) {
        changePlayer();
        var possibilities = [0,1,2,3,4,5,6,7,8];
        var cheatingMove = getARandomOption(possibilities);
        gameBoard[cheatingMove] = 'X'; // Play a 2nd time. Steal the cell if taken
        $('#' + cheatingMove).text('X');
        console.log("computer cheated at " + cheatingMove);
        changePlayer();
        app.turn++;
    }

    else if ((app.turn==7 || app.turn==8) && (gameBoard[4] !== 'X')){
        changePlayer();
        gameBoard[4] = 'X'; // Steal the center
        $('#' + 4).text('X');
        app.turn++;
        console.log("computer cheated by stealing the centers");
        changePlayer();
    }
    else if ((app.turn==7 || app.turn==8) && (gameBoard[8] !== 'X')){
        changePlayer();
        gameBoard[6] = 'X'; // Steal 6 instead of the center
        $('#' + 6).text('X');
        app.turn++;
        console.log("computer cheated by stealing 6");
        changePlayer();
    }
    else if ((app.turn==7 || app.turn==8) && (gameBoard[2] !== 'X')){
        changePlayer();
        gameBoard[6] = 'X'; // Steal 6 instead of the center
        $('#' + 6).text('X');
        app.turn++;
        console.log("computer cheated by stealing 6");
        changePlayer();
    }
    if (checkForWin()) {
        roundWon();
    }
    else if (checkForDraw() && app.round >10){
        for (var i = 0; i < 9; i++) {
            gameBoard[i] = 'X'; // Take all the cells if more than 10 rounds played
            $('#' + i).text('X');
        }
        roundWon();
        alert("Muhahahaa FOR NO REASON AT ALL - I DECIDE TO WIN!");
    }
    changePlayer();
    if (checkForWin()) { //if human can win then the AI just wins
        roundWon();
    }
    changePlayer();
    console.log(app.turn);
}



 function AIHardDefending() {
    console.log(app.turn);
    //The AI hard is almost impossible to beat. Considering using min-max instead.
    //This code is very scenario specific and very hard-coded.
    //This is alpha code.
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("computer played to win");
    }
    else if (doesComputerNeedToBlock()) {
        app.gameBoard[humanAbleToWinAt] = currentPlayer;
        $('#' + humanAbleToWinAt).prepend(currentPlayer);
        console.log("computer played to block human win");
        changePlayer();
        if (checkForDraw()){
            roundDrew();
        }
    }
    else if (app.gameBoard[4] === null) {
        app.gameBoard[4] = currentPlayer;
        $('#' + 4).prepend(currentPlayer);
        changePlayer();
        console.log("Computer took the center to be defensive");
    }
    else if (app.turn == 2 && app.gameBoard[4] == 'O') {
        //Looking for if human going for 'type 1' two way win. Play any corner cell
        //var possibilities = [0,2,6,8];
        //var randomCorner = getARandomOption(possibilities);
        var randomCorner = 0; // Temporary hard code to get working
        $('#' + randomCorner).prepplayedend(currentPlayer); //Add a randomizer here to occasionally play 5
        changePlayer();
        console.log("Computer  in a random corner to block a possible setup of a type 1 two way win");
    }
    else if ((app.turn == 4 && (app.gameBoard[0] == 'O' && (app.gameBoard[8] == 'O')) || (app.turn == 3 && app.gameBoard[2] == 'O' && app.gameBoard[6] == 'O'))){
        //Looking for if human going for 'type 2' two way win () (Two opposing corners)
        //var possibilities = [1,3,5,7];
        //var randomSide = getARandomOption(possibilities);
        var randomside = 3; // Temporary hard code to get working
        $('#' + randomSide).prepend(currentPlayer); //Add a randomizer here to occasionally play 5
        console.log("Computer played T4 to block a possible setup of a type 2 two way win");
        changePlayer();
      }
    // The scenario below is the final scenario the computer needs to consider
    // else if (app.turn == 4 && app.gameBoard[0] == 'O' && app.gameBoard[8] == 'O') {
    //    Looking for if human going for 'type 3' two way win. (A corner wtih a middle 3 units away)
    //    This gets complex as there are 8 scenarios to consider all leading to two way wins
    else {
        playRandomly();
    }
}
