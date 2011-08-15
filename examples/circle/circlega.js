var mapSize = 200;

var circleMid = [100,100];
var circleRadius = 50;
$(document).ready(function(){
	$('#clickit').click(function(){
		numPoints = $('#numPoints').val();
		var popSize = $('#populationSize').val();
		var generations = $('#numGenerations').val();
		var mutability = ($('#mutabilityPercent').val()%100)/100;
		var popDie = ($('#populationDieOff').val()%100)/100; 
		console.log(numPoints + " " + popSize + " " + generations + " " + mutability + " " + popDie);	       		
		Environment.configure({'populationSize':popSize,'generations':generations, 'mutability':mutability,'populationDieOff':popDie });
		Environment.Individual.chromosomeLength=numPoints*2;
		Environment.init();
	});
});

function drawMap(generation){
	var ctx = document.getElementById('gacanvas');	
	ctx = ctx.getContext('2d');
	ctx.clearRect(0,0,mapSize+50,mapSize);
	ctx.beginPath();
	ctx.rect(0,0,mapSize,mapSize);
	ctx.stroke();
	ctx.fillText(generation,200,20);
}

function distanceTo(pointA, pointB){
	return Math.sqrt(Math.pow(pointB[0]-pointA[0],2) + Math.pow(pointB[1]-pointA[1],2));
}


Environment.fitnessFunction = function(individual, draw){
	fitness = 0;	
	if (draw){
		
		var ctx = document.getElementById('gacanvas');	
		ctx = ctx.getContext('2d');
	}
	for(var i = 0; i < individual.chromosomeLength; i+=2){
		var x = individual.chromosome[i];
		var y = individual.chromosome[i+1];	
		distanceToMid = distanceTo([x,y], circleMid);
		fitness+= Math.abs(circleRadius-distanceToMid);
		
		if (draw){
			ctx.beginPath();
			ctx.arc(x,y,1,0,2*Math.PI,true);
			ctx.stroke();
		}
	}
	return -fitness;
}


//Specify my individual - including chromosome length, mate, and init
Environment.Individual = function(){
        this.fitness = 0;
        this.chromosomeLength = numPoints*2;
        this.chromosome = new Array();
        this.mate = function(mutability, mate){
                if (!mate.chromosome){
                        throw "Mate does not have a chromosome";
                }
                var newGuy = new Environment.Individual();
                newGuy.chromosome = this.chromosome.slice(0,Math.floor(this.chromosomeLength)).concat(mate.chromosome.slice(Math.floor(this.chromosomeLength)));

                while (Math.random() < mutability){
                        var mutateIndex = Math.floor(Math.random()*this.chromosomeLength); //a random gene will be mutated;                     
                        newGuy.chromosome[mutateIndex] = Math.random()*mapSize;

                }
                return newGuy;
        }
        //Environment.Individual.prototype.init = function(){
                for (var i = 0; i < this.chromosomeLength;i++){
                        this.chromosome.push(Math.random()*mapSize);
                }
        //}
}

Environment.beforeGeneration = function(generation) {
	drawMap(generation);
}

Environment.afterGeneration = function(generation) {
	Environment.fitnessFunction(Environment.inhabitants[0],true);
	setTimeout("Environment.generation()",100);
};


