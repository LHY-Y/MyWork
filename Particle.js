class Particle {
  constructor(bounds) {
    this.bounds = bounds;
    this.init();
  }

  init() {
    this.pos = createVector(random(this.bounds.w), random(this.bounds.h));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    // 파티클 비주얼
    this.size = random(3, 6);
    this.alpha = 255;
    this.isDisruptor = false;
    this.dead = false;
  }

  run(ageFactor, flowfield) {
    this.update(ageFactor, flowfield);
    this.checkEdges();
    this.display(ageFactor);
  }

  update(ageFactor, flowfield) {
  if (this.isDisruptor) {
    this.applyDisruptorBehavior();
  } else {
    let flow = flowfield.lookup(this.pos, ageFactor);
    this.acc.add(flow);
  }

  // 움직임
  this.vel.add(this.acc);
  this.vel.limit(this.getMaxSpeed(ageFactor));
  this.pos.add(this.vel);
  this.acc.mult(0);
}

  getMaxSpeed(ageFactor) {
    // 나이가 어릴수록 빠르고, 늙을수록 느려짐
    let maxSpeed = map(ageFactor, 0, 1, 2.5, 1.0);

    // disruptor는 약간 다른 성질
    if (this.isDisruptor) {
     maxSpeed = 1.5;
    }

  return maxSpeed;
}

  applyNormalFlow(flowfield, ageFactor) {
    let flow = flowfield.lookup(this.pos, ageFactor);
    this.acc.add(flow);
  }

  applyDisruptorBehavior(flowfield, ageFactor) { //시간이 지날수록 플로우필드
    this.acc.add(random(-0.8, 0.8), random(-0.8, 0.8));
  }

  checkEdges() {
    // Destroy if out of bounds (user requested "destroy off-screen")
    if (this.pos.x < -50 || this.pos.x > this.bounds.w + 50 ||
      this.pos.y < -50 || this.pos.y > this.bounds.h + 50) {
      this.dead = true;
    }
  }

  isDead() {
    return this.dead;
  }

  display(ageFactor) {
    // Visual Properties
    let c;
    let currentSize = this.size;
    let currentAlpha = this.alpha;

    if (this.isDisruptor) {
      c = color(255, 160, 50); // Yellow-Orange
      currentAlpha = 200;
      currentSize = random(4, 8);
    } else {
      // Turquoise fading to greyish white
      let r = lerp(0, 150, ageFactor);
      let g = lerp(255, 180, ageFactor);
      let b = lerp(220, 200, ageFactor);
      c = color(r, g, b);

      // Blur increases with age (size up, alpha down)
      currentSize = map(ageFactor, 0, 1, 2.5, 6.0);
      currentAlpha = map(ageFactor, 0, 1, 180, 60);
    }

    // Pulse effect
    let pulse = sin(frameCount * 0.05 + this.pos.x * 0.01) * 0.5 + 1;
    let finalSize = currentSize * pulse;

    noStroke();

    if (this.isDisruptor) {
      fill(red(c), green(c), blue(c), currentAlpha);
      ellipse(this.pos.x, this.pos.y, finalSize);
      // Core
      fill(255, 255, 200, 200);
      ellipse(this.pos.x, this.pos.y, finalSize * 0.4);
    } else {
      fill(red(c), green(c), blue(c), currentAlpha);
      // Add hand-drawn jitter
      let jx = random(-0.5, 0.5);
      let jy = random(-0.5, 0.5);
      ellipse(this.pos.x + jx, this.pos.y + jy, finalSize);
    }
  }
}
