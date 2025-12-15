class FlowField {
  constructor() {}

  lookup(pos, ageFactor) {
    let nScale = map(ageFactor, 0, 1, 0.005, 0.02);
    let time = frameCount * 0.005;
    let n = noise(pos.x * nScale, pos.y * nScale, time);
    let angle = n * TWO_PI * 2;

    let v = p5.Vector.fromAngle(angle);
    let strength = map(ageFactor, 0, 1, 0.5, 0.1);
    v.setMag(strength);
    return v;
  }
}