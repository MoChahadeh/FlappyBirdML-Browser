const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
const POPULATION_SIZE = 40;

const birdsGroup = [];
let nets = [];
const pipesGroup = [];
const dead = new Array(POPULATION_SIZE).fill(false);
let fitness = new Array(POPULATION_SIZE).fill(0);
let copyBest = 3;

let STARTED = true;


function setDimensions() {
    if(window.innerHeight*2 > window.innerWidth) { //portrait
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerWidth/2;
    } else {
        width = canvas.width = window.innerHeight *2;
        height = canvas.height = window.innerHeight;
        
    }

    birdsGroup.forEach(bird => {
        bird.onresize(width, height);
    })

    pipesGroup.forEach(pipe => {
        pipe.onresize(width, height);
    })

    // width = canvas.width = 800;
    // height = canvas.height = 400;

}
setDimensions();
window.onresize = setDimensions;


const bird = new Bird(birdsGroup, 0, pipesGroup, width, height);

for(let i = 0; i< 8; i++) {

    pipesGroup.push(new Pipe(pipesGroup, height, width, width + i*0.2*width, Math.random()*height*0.6))

}

for(let i = 0; i< POPULATION_SIZE; i++) {

    birdsGroup.push(new Bird(birdsGroup, i, pipesGroup, width, height));
    nets.push(new NeuralNet(1, 3, null, 1));

}

function maximums(arr) {

    const sortedArr = [...arr].sort((a,b) => b-a);

    const res = sortedArr.map((el, i) => arr.indexOf(el));

    return res;

}

function resetGame() {

    console.log("ALL DEAD!");

    pipesGroup.forEach(pipe => pipe.kill());


    birdsGroup.length = [];
    pipesGroup.length = [];

    for(let i = 0; i< 8; i++) {

        pipesGroup.push(new Pipe(pipesGroup, height, width, width + i*0.2*width, height - Math.random()*height*0.4))
    
    }
    
    for(let i = 0; i< POPULATION_SIZE; i++) {
    
        birdsGroup.push(new Bird(birdsGroup, i, pipesGroup, width, height));    
    }

    console.log("fitness: ", [...fitness])
    const maximumsList = maximums([...fitness]);

    console.log("maxFitness: ", maximumsList[0], "maximums Length: ", maximumsList.length);

    for(let i = 0; i< POPULATION_SIZE; i++) {
        nets.push(nets[maximumsList[i%copyBest]].clone().mutate(0.05));
        nets.splice(0,1);
    }


    dead.fill(false);
    fitness.fill(0);

}

function animate() {
    ctx.clearRect(0, 0, width, height);

    birdsGroup.forEach(bird => {

        if (bird.dead) {
            dead[bird.index] = true;
            return;
        };

        const closestPipe = pipesGroup.filter(pipe => pipe.pos.x+(pipe.width-20) > bird.pos.x).sort((a,b) => a.pos.x - b.pos.x)[0];

        const inputs = [[(closestPipe.middle.y - (bird.pos.y + bird.height/2))*10/height]] //, (closestPipe.middle.x - (bird.pos.x + bird.width/2))/width]];

        const output = nets[bird.index].forward(inputs);

        if(output[0] >= 0.5) bird.jump();

        fitness[bird.index] += 1;

    })

    birdsGroup.forEach(bird => bird.update());
    pipesGroup.forEach(pipe => pipe.update());

    if(dead.every(d => d === true)) resetGame();

    setTimeout(animate, 1000/60);
}

animate();