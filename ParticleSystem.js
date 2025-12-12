class ParticleSystem {
    constructor() {
        this.particles=[];
    }

    addParticle() {
      this.particles.push(new Particle);
    }

    run(flowfield) {
      for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      p.follow(flowfield);     
      p.run();

      if (p.isDead()) {
      this.particles.splice(i, 1);
      }
    }       
    }
}