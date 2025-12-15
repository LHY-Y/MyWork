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

  run(ageFactor) {
    this.getFlowVector(ageFactor);
    this.update(ageFactor);
    this.checkEdges();
    this.display(ageFactor);
  }

  getFlowVector(ageFactor) { //flowfield 계산
    let nScale = map(ageFactor, 0, 1, 0.005, 0.02);
    let time = frameCount * 0.005;
    let n = noise(this.pos.x * nScale, this.pos.y * nScale, time); //노이즈 값
    this.angle = n * TWO_PI * 2; //시간 흐를수록 꼬이게

    let v = createVector(cos(this.angle), sin(this.angle));
    let strength = map(ageFactor, 0, 1, 0.5, 0.1);
    v.setMag(strength);
    return v;
  }


  update(ageFactor) {
    if (!this.isDisruptor && ageFactor > 0.8 && random(1) < 0.005) {
      this.isDisruptor = true;
    }

    // Create flow vector directly
    let flowX = cos(this.angle);
    let flowY = sin(this.angle);

    // Flow Strength: Strong cohesion in young cells, weak in old
    let flowStrength = map(ageFactor, 0, 1, 0.5, 0.1);

     if (this.isDisruptor) {
      this.applyDisruptorBehavior();
    } else {
      this.applyNormalFlow(ageFactor);
    }

      // Apply flow strength
      // Normalize roughly
      let mag = sqrt(flowX * flowX + flowY * flowY);
      if (mag > 0) {
        flowX = (flowX / mag) * flowStrength;
        flowY = (flowY / mag) * flowStrength;
      }

      this.acc.x += flowX;
      this.acc.y += flowY;

    // Base speed
    let maxSpeed = map(ageFactor, 0, 1, 2.5, 1.0);
    if (this.isDisruptor) maxSpeed = 1.5;

    // Physics update
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyNormalFlow(ageFactor) { //기본 플로우필드
    let flow = this.getFlowVector(ageFactor);
    this.acc.add(flow);
  }

  applyDisruptorBehavior() { //시간이 지날수록 플로우필드
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
