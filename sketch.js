let simulation;
let startTime;
let flowfield;
const MAX_PARTICLES = 1200; // Optimized count
const CYCLE_DURATION = 60; // 한 사이클 당 시간(초)

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB, 255);
    background(5, 12, 25);

    simulation = new AgingSimulation(MAX_PARTICLES, width, height);
    flowfield = new FlowField(20, width, height);
    startTime = millis();
}

function draw() {
    // Trail effect
    blendMode(BLEND);
    fill(5, 12, 25, 30);
    noStroke();
    rect(0, 0, width, height);

    // Calculate Age Factor (0.0 to 1.0) based on time
    let elapsed = (millis() - startTime) / 1000;
    let t = min(elapsed / CYCLE_DURATION, 1);

    // Additive blending for glow
    blendMode(ADD);

    simulation.run(t, flowfield);

    if (mouseIsPressed) {
        simulation.interact(mouseX, mouseY, flowfield);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(5, 12, 25);
    // Re-init simulation bounds if needed, or just let particles die off-screen
    simulation.bounds = { w: width, h: height };
}
