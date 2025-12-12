let cell;
let flowfield;

function setup() {
    createCanvas(600, 400);
    cell = new ParticleSystem();
    flowfield = new FlowField(20);
}

function draw() { 
    background(0);

    flowfield.update();          
    
    cell.addParticle();
    cell.run(flowfield); 
}