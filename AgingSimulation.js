class AgingSimulation {
    constructor(maxParticles, width, height) {
        this.maxParticles = maxParticles;
        this.bounds = { w: width, h: height };
        this.particles = [];

        // Initial population
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.bounds));
        }
    }

    run(ageFactor, flowfield) {
        // Update and draw existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.run(ageFactor, flowfield);

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        // Replenish particles if below max
        // Spawn new ones at random edges or random positions to maintain flow
        // To prevent "popping", maybe spawn them just outside screen flowing in?
        // For simplicity and requested "continuous play", spawning random is okay, 
        // but spawning at edges is better for "flow".
        // Let's spawn random for now as per user's snippet "init() -> random pos", 
        // but maybe we can optimize to spawn at edges if the flow is strong.
        // User snippet just does "random(minX, maxX)".

        while (this.particles.length < this.maxParticles) {
            let p = new Particle(this.bounds);
            // Optional: Reset position to be entering the screen? 
            // For now, just new Particle() which inits at random pos.
            this.particles.push(p);
        }
    }
}

