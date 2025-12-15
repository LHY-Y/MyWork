class FlowField {
    constructor(resolution, width, height) {
        this.resolution = resolution;
        this.cols = ceil(width / resolution) + 1;
        this.rows = ceil(height / resolution) + 1;
        this.field = [];
        this.grid = []; // Stores grid points
        this.init();
    }

    init() {
        this.field = new Array(this.cols * this.rows);
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid.push({
                    baseX: x * this.resolution,
                    baseY: y * this.resolution,
                    x: x * this.resolution,
                    y: y * this.resolution,
                    userDistortionX: 0,
                    userDistortionY: 0
                });
            }
        }
    }

    update(ageFactor) {
        // ageFactor: 0.0 (taut) -> 1.0 (wrinkled)
        let time = frameCount * 0.005;

        // Global aging distortion scale
        // As age increases, the grid naturally distorts more
        let ageDistortionScale = map(ageFactor, 0, 1, 0, 20);
        let noiseScale = 0.02;

        for (let i = 0; i < this.grid.length; i++) {
            let p = this.grid[i];

            // Calculate natural aging distortion
            // Use noise based on original position to keep it coherent
            let nX = noise(p.baseX * noiseScale, p.baseY * noiseScale, time);
            let nY = noise(p.baseX * noiseScale + 1000, p.baseY * noiseScale + 1000, time);

            let ageDX = map(nX, 0, 1, -ageDistortionScale, ageDistortionScale);
            let ageDY = map(nY, 0, 1, -ageDistortionScale, ageDistortionScale);

            // Apply user distortion (accumulated)
            // User distortion doesn't decay, it accumulates (as per "can't stop it")
            // Or maybe it decays very slowly? Let's keep it permanent for now.

            p.x = p.baseX + ageDX + p.userDistortionX;
            p.y = p.baseY + ageDY + p.userDistortionY;

            // Update flow vector based on DISTORTED position (Domain Warping)
            // This ensures particles follow the visual grid lines
            let flowAngle = noise(p.x * 0.01, p.y * 0.01, time) * TWO_PI * 2;
            let v = p5.Vector.fromAngle(flowAngle);

            // Strength varies
            v.setMag(1.0);
            this.field[i] = v;
        }
    }

    interact(mx, my, radius) {
        // Add distortion to grid points near mouse
        for (let i = 0; i < this.grid.length; i++) {
            let p = this.grid[i];
            let d = dist(mx, my, p.x, p.y);

            if (d < radius) {
                // Direction from mouse to point
                let angle = atan2(p.y - my, p.x - mx);
                // Push points away or twist them?
                // "Crumple" -> Random noise or push?
                // Let's add random distortion to simulate wrinkling
                let force = map(d, 0, radius, 5, 0);
                p.userDistortionX += random(-force, force);
                p.userDistortionY += random(-force, force);
            }
        }
    }

    lookup(position) {
        // Map position to grid index
        // Since grid is distorted, this is an approximation
        let col = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
        let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
        let index = col + row * this.cols;
        return this.field[index] ? this.field[index].copy() : createVector(0, 0);
    }

    display() {
        // Darker blue, very low opacity for subtle background effect
        stroke(50, 100, 150, 15);
        strokeWeight(1);
        noFill();

        // Draw horizontal lines
        for (let y = 0; y < this.rows; y++) {
            beginShape();
            for (let x = 0; x < this.cols; x++) {
                let index = x + y * this.cols;
                let p = this.grid[index];
                vertex(p.x, p.y);
            }
            endShape();
        }

        // Draw vertical lines
        for (let x = 0; x < this.cols; x++) {
            beginShape();
            for (let y = 0; y < this.rows; y++) {
                let index = x + y * this.cols;
                let p = this.grid[index];
                vertex(p.x, p.y);
            }
            endShape();
        }
    }
}
