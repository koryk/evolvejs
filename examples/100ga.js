Environment.configure({'populationSize':20,'generations':10, 'mutability':0.333,'populationDieOff':0.5 });
//Fitness function circle, radius of 5!
Environment.fitnessFunction = function(individual){
        var total = 0;
        console.log('chromosome ' +individual.chromosome);
        for (gene in individual.chromosome){
                total += individual.chromosome[gene];
        }
        return 100 - Math.abs(100-total);
}
//Specify my individual - including chromosome length, mate, and init
Environment.Individual = function(){
        this.fitness = 0;
        this.chromosomeLength = 50;
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
        }
        Environment.Individual.prototype.init = function(){
                for (var i = 0; i < this.chromosomeLength;i++){
                        this.chromosome.push(Math.random());
                }
        }
}

Environment.beforeGeneration = function(generation) {
        console.log('Generation: ' + generation);
}

Environment.afterGeneration = function(generation) {
        for(individual in Environment.inhabitants){
                console.log(Environment.inhabitants[individual].fitness);
        }
};

Environment.run();

