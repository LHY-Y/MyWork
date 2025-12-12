class Particle {
    constructor() {
        this.position=createVector(random(0,width),random(0,height));
        this.lifespan = 255;
    }

    update() {
    this.lifespan -= 1.5;
    }

    display() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
    }

    run() {
    this.update();
    this.display();
  }

    isDead() {
    return this.lifespan < 0;
    }
}