let particleSystem;

function setup() {
  createCanvas(600, 400);
  particleSystem = new ParticleSystem();
}

function draw() {
  background(0);
  particleSystem.addParticle();
  particleSystem.run();
}