//Fitness function!
var numPoints = 30;
var mapSize = 200;
var circleMid = [100,100];
var circleRadius = 50;
$(document).ready(function(){
	$('#clickit').click(function(){
		numPoints = $('#numPoints').val();
		Environment.configure({'populationSize':300,'generations':3000, 'mutability':0.7,'populationDieOff':0.3 });
		Environment.init();
	});
});

function drawMap(generation){
	var ctx = document.getElementById('gacanvas');	
	ctx = ctx.getContext('2d');
	ctx.clearRect(0,0,mapSize+50,mapSize);
	ctx.fillText(generation,200,20);
}

function distanceTo(pointA, pointB){
	return Math.sqrt(Math.pow(pointB[0]-pointA[0],2) + Math.pow(pointB[1]-pointA[1],2));
}

function arrayIndex(arr, val){
	for (var i = 0; i < arr.length; i++){
		if (arr[i] == val){
			return i;
		}
	}
	return -1;
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
        Environment.Individual.prototype.init = function(){
                for (var i = 0; i < this.chromosomeLength;i++){
                        this.chromosome.push(Math.random()*mapSize);
                }
        }
}

Environment.beforeGeneration = function(generation) {
        //console.log('Generation: ' + generation);
	drawMap(generation);
}

Environment.afterGeneration = function(generation) {
        for(individual in Environment.inhabitants){
               ;// console.log(Environment.inhabitants[individual].fitness);
	}
	Environment.fitnessFunction(Environment.inhabitants[0],true);
	setTimeout("Environment.generation()",100);	
};


