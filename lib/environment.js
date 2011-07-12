var Environment = (function () {
	var my = {
		name: 'default environment',
		populationSize:  0,
		mutability: 0.0,
		populationDieOff: 0.0,
		generations: 0
	}; //public stuff
	
	var validKeys = { 
		'name':0,
		'populationSize':0,
		'mutability':0,
		'populationDieOff':0,
		'generations':0,
	};
	
	var checkConfiguration = function(){
		if (my.populationSize <= 0)
			throw "Population size must be positive";
		if (my.mutability > 1 || this.mutability < 0)
			throw "Mutability must be 0 <= mutability <= 1";
		if (my.populationDieOff > 1 || this.populationDieOff < 0)
			throw "Population Die Off must be 0 <= populationDieOff <= 1";
		if (my.generations <= 0)
			throw "Generations must be positive";
		if (typeof my.fitnessFunction !== 'function'){
			throw "Fitness function not present";	
		}
		if (my.Individual == undefined){

			throw "Individuals are undefined";
		} 
		else {
			var myIndividual = new my.Individual();
			if (typeof myIndividual.mate !== 'function'){
				throw "Individual has no mate function";
			} 
			if (!myIndividual.chromosome){
				throw "Individual has no chromosome";
			} 
			
		}
	};

	var populate = function(){
		for (var i = 0; i < my.populationSize; i++){
			var inhabitant = new my.Individual();
			inhabitant.init();
			my.inhabitants.push(inhabitant);	
		}
		my.evaluatePopulation();
	}

	my.DefaultIndividual = function() {
		this.prototype.chromosome = {};
		this.prototype.chromosomeLength = 0;
		this.prototype.mate = function(){
		};
					
	};

	my.Individual = undefined;

	my.inhabitants = new Array();

	my.fitnessFunction = undefined;
	
	my.configure = function (configArray){
		for (prop in validKeys){
			if (configArray.hasOwnProperty(prop)){
				my[prop] = configArray[prop];
			}
		}		
	}

	my.afterGeneration = function(){};

	my.beforeGeneration = function(){};	

	my.evaluatePopulation = function() {
		for(individual in my.inhabitants){
			my.inhabitants[individual].fitness = my.fitnessFunction(my.inhabitants[individual]);		
		}
		my.inhabitants.sort(function(a,b) {
			if (a.fitness > b.fitness) 
				return -1;
			if (a.fitness < b.fitness) 
				return 1;
			return 0;
		});	
	};

	my.nextGeneration = function()
		{
		var keepSize = Math.floor(my.populationSize * (1-my.populationDieOff));
		my.inhabitants = my.inhabitants.slice(0,keepSize);	
		for (var popIndex = 0; popIndex < my.populationSize - keepSize; popIndex++){
			var parentOne = my.inhabitants[Math.floor(Math.random()*keepSize)];
			var parentTwo = my.inhabitants[Math.floor(Math.random()*keepSize)];
			my.inhabitants.push(parentOne.mate(my.mutability,parentTwo));
		}		
	};
	my.init = function() {
		my.inhabitants = new Array();
		checkConfiguration();
		my.currentgen = 0;
		populate();
		my.generation();
	}
	my.currentgen = 0;
	my.generation = function(){
		if (my.currentgen >= my.generations)
			return;
		my.beforeGeneration(my.currentgen);
		my.nextGeneration();
		my.evaluatePopulation();
		my.currentgen++;						
	
		return my.afterGeneration(my.currentgen);
	}	
	my.run = function() {
		try {
			checkConfiguration();
			populate();
			for (var generation = 0; generation < my.generations; generation++){
				my.beforeGeneration(generation);
				my.nextGeneration();
				my.evaluatePopulation();
				my.afterGeneration(generation);
			}			
		} 
		catch (e) {
			console.log('Error, Cannot run environment ' + my.name +  ': ' + e);
		}
		return my.inhabitants;
	}
	return my;
}());


