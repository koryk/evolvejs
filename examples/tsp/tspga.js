//Fitness function!
var travelingSalesman = new Array();
var numNodes = 30;
var mapSize = 200;

$(document).ready(function(){
	$('#clickit').click(function(){
		numNodes = $('#numPoints').val();
		initNodes();
		Environment.configure({'populationSize':300,'generations':300, 'mutability':0.7,'populationDieOff':0.3 });
		Environment.init();
	});
});

function drawMap(generation){
	var ctx = document.getElementById('gacanvas');	
	ctx = ctx.getContext('2d');
	ctx.clearRect(0,0,mapSize+50,mapSize);
	ctx.fillText(generation,200,20);
	for (var i = 0; i < numNodes; i++){
		ctx.beginPath();
		ctx.arc(travelingSalesman[i][0],travelingSalesman[i][1],1,0,2*Math.PI, true);
		ctx.stroke();
	}
}
function initNodes(){
	travelingSalesman = new Array();
	for (var i = 0; i < numNodes; i++){
		travelingSalesman.push([Math.random()*mapSize,Math.random()*mapSize]);
	}
}

function distanceTo(pointA, pointB){
	return Math.pow(pointB[0]-pointA[0],2) + Math.pow(pointB[1]-pointA[1],2);
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
	
	var sortedNums = [];
    for (var i = 0; i < travelingSalesman.length; i++){
		sortedNums.push({index:i, value:individual.chromosome[i]});
	}
	
	var sortedNums = sortedNums.sort(
		function(a, b){
			if (a.value < b.value)
				return -1;
			if (b.value < a.value)
				return 1;
			return 0;	
		}
	);
	var totalDistance = 0;
	
	if (draw){
		var ctx = document.getElementById('gacanvas');	
		ctx = ctx.getContext('2d');
	}
	
	for (var i = 0; i < sortedNums.length-1; i++){
		var firstOne = travelingSalesman[sortedNums[i].index];
		var secondOne = travelingSalesman[sortedNums[i+1].index];
		totalDistance += distanceTo(firstOne, secondOne);		
		
		if (ctx){
			ctx.beginPath();
			ctx.moveTo(firstOne[0],firstOne[1]);
			ctx.lineTo(secondOne[0],secondOne[1]);
			ctx.stroke();
		}
		
	}
	return -totalDistance; 
}


//Specify my individual - including chromosome length, mate, and init
Environment.Individual = function(){
        this.fitness = 0;
        this.chromosomeLength = numNodes;
        this.chromosome = new Array();
        this.mate = function(mutability, mate){
                if (!mate.chromosome){
                        throw "Mate does not have a chromosome";
                }
                var newGuy = new Environment.Individual();
                newGuy.chromosome = this.chromosome.slice(0,Math.floor(this.chromosomeLength)).concat(mate.chromosome.slice(Math.floor(this.chromosomeLength)));

                while (Math.random() < mutability){
                        var mutateIndex = Math.floor(Math.random()*this.chromosomeLength); //a random gene will be mutated;                     
                        newGuy.chromosome[mutateIndex] = (1 << (Math.floor(Math.random()*16))) ^ newGuy.chromosome[mutateIndex];
                }
                return newGuy;
        };
        
        Environment.Individual.prototype.init = function(){
                for (var i = 0; i < this.chromosomeLength;i++){
                        this.chromosome.push(Math.random());
                }
        };
};

Environment.beforeGeneration = function(generation) {
	drawMap(generation);
};

Environment.afterGeneration = function(generation) {
    for(individual in Environment.inhabitants){
          console.log(Environment.inhabitants[individual].fitness);
	}
	Environment.fitnessFunction(Environment.inhabitants[0],true);
	setTimeout("Environment.generation()",500);	
};


