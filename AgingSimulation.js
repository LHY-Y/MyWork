class AgingSimulation {
    constructor(maxParticles, width, height) {
        this.maxParticles = maxParticles;
        this.bounds = { w: width, h: height };
        this.particles = [];

        // 초기 세포 수량
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.bounds));
        }
    }

    run(ageFactor, flowfield) {
        flowfield.update(ageFactor);
        flowfield.display(); //그리드

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.run(ageFactor, flowfield);

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        while (this.particles.length < this.maxParticles) {
            let p = new Particle(this.bounds);
            this.particles.push(p);
        }
    }

    interact(mx, my, flowfield) {
    // Pass interaction to flow field
    // Radius of effect = 50px (smaller for more local wrinkling)
    flowfield.interact(mx, my, 50);
    }
}

