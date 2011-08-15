mapSize = 200;
playWinner = true;
currentGame = null;
$(document).ready(function(){
	$('#clickit').click(function(){
		var popSize = $('#populationSize').val();
		var generations = $('#numGenerations').val();
		var mutability = ($('#mutabilityPercent').val()%100)/100;
		var popDie = ($('#populationDieOff').val()%100)/100;
		Environment.configure({'populationSize':popSize,'generations':generations, 'mutability':mutability,'populationDieOff':popDie});
                Environment.init();
	});
        $('#gacanvas').click(function(e){
            var x = e.pageX - $('#gacanvas').offset().left;
            var y = e.pageY - $('#gacanvas').offset().top;
            if (currentGame != null){
                if (currentGame.turn == 1){
                    var index = getBoardIndex(x,y);
                    var spotx = index%3;
                    var spoty = Math.floor(index/3);
                    if (currentGame.gameState[spotx][spoty] == -1){
                        currentGame.gameState[spotx][spoty] = 1;
                        var ctx = document.getElementById('gacanvas');

                        ctx = ctx.getContext('2d');
                        ctx.beginPath();
                        ctx.arc(35 + (60*(spotx)), 30 + (60*(spoty)), 5, 0, Math.PI*2, true);
                        ctx.stroke();
                        if (checkForWin(currentGame.gameState, 1)){
                            setText("You Win! <a href='javascript:startGame()'>play again</a>");
                        }
                        else {
                            currentGame.turn = 0;
                            currentGame.numTurns++;
                            currentGame.nextTurn();
                        }
                    }
                }
            }
        });
});
function drawMap(generation){
        clearMap();
        var ctx = document.getElementById('gacanvas');
	ctx = ctx.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(5,60);
        ctx.lineTo(195,60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(5,120);
        ctx.lineTo(195,120);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(65,5);
        ctx.lineTo(65,185);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(130,5);
        ctx.lineTo(130,185);
        ctx.stroke();
        console.log("Drawing generation " + generation);
	ctx.fillText(generation + "",200,20);
}
var tictactoe = function(){
turns = [
  [4,3],
  [4,3,3,3],
  [4,3,3,3,3,3],
  [4,3,3,3,3,2,2,2],
  [4,3,3,3,3,2,2,2,1],

];
this.simulateGame = function(firstGuy,secondGuy, draw){
    var gameState = [
                        [-1,-1,-1],
                        [-1,-1,-1],
                        [-1,-1,-1]
    ];
    
    if (draw){
        var ctx = document.getElementById('gacanvas');
	ctx = ctx.getContext('2d');
    }
   
    var guys = [firstGuy,secondGuy];
    var show = false;
    for (var i=0;i<turns.length;i++){
        for (var q=0;q<guys.length;q++){
            var wentturn = false;
            var availableIndices = new Array();
            for (var n=0; n<9; n++){
                    availableIndices[n]=n;
            }
            for (var j=0;j<turns[i].length;j++){
                var index = getValueFromChrom(guys[q].chromosome,i,j)%availableIndices.length;
                var tryVal = availableIndices[index];
                var spotx = tryVal%3;
                var spoty = Math.floor(tryVal/3);
                if (gameState[spotx][spoty] != -1){
                    if (show){
                        console.log(availableIndices.join());
                        console.log("Trying index " + index + " place " + spotx + ", " + spoty);
                    }

                    availableIndices.splice(index,1);
                    tmpArray = new Array();
                    for (vari in availableIndices){
                        tmpArray.push(availableIndices[vari]);
                    }
                    availableIndices = tmpArray;
                    continue;
                }
                gameState[spotx][spoty] = q;
                wentturn = true;
                
                break;
            }
            
            show = false;
            if (draw)
                this.drawGame(gameState,ctx);
            if (checkForWin(gameState,q)){                
                return q;
            }
        }
    }

}
this.drawGame = function (gameState, ctx){
    for (var i = 0; i < gameState.length; i++){
        for (var j = 0; j < gameState[i].length; j++){
            if (gameState[i][j]!= -1){
                ctx.beginPath();
                if (gameState[i][j]==1){
                    ctx.arc(35 + (60*(i)), 30 + (60*(j)), 5, 0, Math.PI*2, true);
                    ctx.stroke();    
                } 
                else {
                    ctx.moveTo(30 + (60*i), 25 + (60*j));
                    ctx.lineTo(40 + (60*i), 35 + (60*j));
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(40 + 60*i, 25 + (60*j));
                    ctx.lineTo(30 + 60*i, 35 + (60*j));
                    ctx.stroke();
                }
            }
        }
    }
}
clearMap = function () {

    var ctx = document.getElementById('gacanvas');
	ctx = ctx.getContext('2d');
	ctx.clearRect(0,0,mapSize+100,mapSize);
	ctx.beginPath();
	ctx.rect(0,0,mapSize,mapSize);
	ctx.stroke();
}
checkForWin = function(gameState, winner){
    for (var i=0;i<3;i++){
        if (gameState[i][0] == winner && gameState[i][1] == winner && gameState[i][2] == winner)
            return true;
        if (gameState[0][i] == winner && gameState[1][i] == winner && gameState[2][i] == winner)
            return true;
    }
    if (gameState[0][0] == winner && gameState[1][1] == winner && gameState[2][2] == winner)
        return true;
    if (gameState[2][0] == winner && gameState[1][1] == winner && gameState[0][2] == winner)
        return true;
    return false;
}
getValueFromChrom = function(chrom,turn,numtry){
    var totalbits=0;
    for (var i = 0; i < turn; i++){
        for (var j=0;j<turns[i].length;j++){
            totalbits += turns[i][j];
        }
    }
    for (var i = 0; i < numtry; i++)
        totalbits+=turns[turn][i];
   var retval = 0;
    for (var i = totalbits; i < totalbits+turns[turn][numtry]; i++){
        retval += chrom[i]? 1 << (i-totalbits) : 0;

    }

   return retval;
}
};

Environment.fitnessFunction = function(individual, draw){
    var fitness = 0;
    for (var i = 0; i < Environment.inhabitants.length; i++){
        if ((new tictactoe()).simulateGame(individual,Environment.inhabitants[i])==0)
            fitness++;
        else
            fitness--;
        if ((new tictactoe()).simulateGame(Environment.inhabitants[i],individual)==0)
            fitness--;
        else
            fitness++;
    }
    return fitness;
}

Environment.Individual = function(){
        this.fitness = 0;
        this.chromosomeLength = 53;
        this.chromosome = new Array();
        this.mate = function(mutability, mate){
                if (!mate.chromosome){
                        throw "Mate does not have a chromosome";
                }
                var newGuy = new Environment.Individual();
                newGuy.chromosome = this.chromosome.slice(0,Math.floor(this.chromosomeLength)).concat(mate.chromosome.slice(Math.floor(this.chromosomeLength)));

                while (Math.random() < mutability){
                        var mutateIndex = Math.floor(Math.random()*this.chromosomeLength); //a random gene will be mutated;
                        newGuy.chromosome[mutateIndex] = !newGuy.chromosome[mutateIndex];
                }
                return newGuy;
        }
        //Environment.Individual.prototype.init = function(){
                for (var i = 0; i < this.chromosomeLength;i++){
                        this.chromosome.push((Math.random()>.5));
                }
        //}
}

Environment.beforeGeneration = function(generation) {
	
        drawMap(generation);
        setText("");
}

Environment.afterGeneration = function(generation) {
        for(individual in Environment.inhabitants){
               //console.log(Environment.inhabitants[individual].fitness);
	}
        
	
        new tictactoe().simulateGame(Environment.inhabitants[0],Environment.inhabitants[1],true);
        setTimeout("Environment.generation()",2000);
        if (generation >= Environment.generations){
            console.log("Playing Generation " + generation);
            startGame();
        }
}

var TicTacToe = function(individual) {
    this.opponent = individual;
    this.nextTurn = function() {
        var ctx = document.getElementById('gacanvas');
        ctx = ctx.getContext('2d');
        if (this.numTurns >= turns.length){
            setText("You Tie! <a href='javascript:startGame()'>play again</a>", 50,50);
            return;
        }
        var turnOptions = turns[this.numTurns];
        var availableIndices = new Array();
        for (var n=0; n<9; n++){
                availableIndices[n]=n;
        }
        for (var j=0;j<turnOptions.length;j++){
                var index = getValueFromChrom(individual.chromosome,this.numTurns,j)%availableIndices.length;
                var tryVal = availableIndices[index];
                var spotx = tryVal%3;
                var spoty = Math.floor(tryVal/3);
                if (this.gameState[spotx][spoty] != -1){
                    availableIndices.splice(index,1);
                    tmpArray = new Array();
                    for (vari in availableIndices){
                        tmpArray.push(availableIndices[vari]);
                    }
                    availableIndices = tmpArray;
                    console.log("Tried " + spotx + ", " + spoty);
                    continue;
                }
                this.gameState[spotx][spoty] = 0;
                console.log("Chose spot " + spotx + "," + spoty);
                ctx.beginPath();
                ctx.moveTo(30 + (60*spotx), 25 + (60*spoty));
                ctx.lineTo(40 + (60*spotx), 35 + (60*spoty));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(40 + 60*spotx, 25 + (60*spoty));
                ctx.lineTo(30 + 60*spotx, 35 + (60*spoty));
                ctx.stroke();
                if (checkForWin(currentGame.gameState, 0)){
                            
                            setText("You Lose! <a href='javascript:startGame()'>play again</a>");
                            setTimeout("Environment.generation()",6000);
                }
                this.turn = 1;
                
                break;
        }
        if (this.numTurns >= turns.length-1){
            setText("You Tie! <a href='javascript:startGame()'>play again</a>", 50,50);
            return;
        }
    }
    this.gameState = [
                        [-1,-1,-1],
                        [-1,-1,-1],
                        [-1,-1,-1]
    ];
    this.turn = 0;
    this.numTurns = 0;
    
}
var startGame = function() {
    clearMap();
    setText("Playing against the best player after " + Environment.generations + " generations.");
    drawMap(Environment.generations);
    currentGame = new TicTacToe(Environment.inhabitants[0]);
    currentGame.nextTurn();
}
var getBoardIndex = function(x,y) {
    var row = Math.abs(Math.floor((y)/60));
    var column = Math.abs(Math.floor((x-5)/60));
    if (row > 2)
        row = 2;
    if (column > 2)
        column = 2;
    return (row*3 + column)
}
var setText = function(txt) {
    $("#result-div").html(txt);
}