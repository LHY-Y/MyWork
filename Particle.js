class Particle {
    constructor() {
        this.position=createVector(random(0,width),random(0,height));
        this.velocity=createVector(0,0);
        this.accerlation=createVector(0.0);

        this.lifespan = 255;
    }


    applyForce(force) {
    this.accerlation.add(force);
    }

    follow(FlowField) {
    let force = FlowField.lookup(this.position);
    this.applyForce(force);
    }

    update() {
    this.velocity.add(this.accerlation);
    this.position.add(this.velocity);
    this.accerlation.mult(0);
    
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