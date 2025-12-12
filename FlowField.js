class FlowField {
    constructor(scl) {
        this.scl = scl; //화면의 타일(grid)
        this.cols = floor(width / this.scl); //가로에 그리드가 몇 칸 있는지
        this.rows = floor(height / this.scl); //세로에 그리드가 몇 칸 있는지
        this.field = new Array(this.cols * this.rows); //2차원 공간 데이터를 1차원 배열에 저장
        this.zoff = 0; //노이즈는 3차원 형태(움직임 적용을 위해)
    }

    update() {
        let xoff = 0;
        for (let x = 0; x < this.cols; x++) {
        let yoff = 0;
        for (let y = 0; y < this.rows; y++) {
        let index = x + y * this.cols;

        let angle = noise(xoff, yoff, this.zoff) * TWO_PI * 2; //노이즈를 각의 형태로 변환

        let v = p5.Vector.fromAngle(angle);  //angle형태의 vector생성
        v.setMag(1); //angle vector값을  0-1 사이 범위로 변환 

        this.field[index] = v; //스크린에 적용(?)

        yoff += 0.1;
        }
        xoff += 0.1;
        }

        this.zoff += 0.01;
    }

   
    lookup(position) {
    let col = floor(constrain(position.x / this.scl, 0, this.cols - 1));
    let row = floor(constrain(position.y / this.scl, 0, this.rows - 1)); // 화면 이탈 방지
    let index = col + row * this.cols;
    return this.field[index].copy();
  }
}
