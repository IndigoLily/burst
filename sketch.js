new p5();

let gravity = createVector(0, .25),
    drag = .99;

function particle(x,y,r) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 20 - Math.random() * 15);
  this.vel.rotate(Math.random()*TAU);
  this.r = r || 15 + Math.random() * 5;

  this.update = function() {
    this.vel.add(gravity);

    this.vel.mult(drag);
    this.pos.add(p5.Vector.mult(this.vel, 1));
    this.r = this.vel.mag();
  }
  this.draw = function() {
    noStroke();
    let b = this.vel.mag()*12;
    fill(b,0,b);
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}

let ps = [];

function burst(x,y,n) {
  x = x || Math.random() * width;
  y = y || Math.random() * height;
  n = n || 80 + Math.random() * 220;
  for(let i = 0; i < n; i++) {
    ps.push(new particle(x,y));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(230);

  if(Math.random() < .1 && frameRate() > 45) {
    burst();
  }

  for(let i = 0; i < ps.length; i++) {
    let p = ps[i];
    p.update();
    p.draw();
  }

  for(let i = ps.length-1; i >= 0; i--) {
    let p = ps[i].pos;
    if(p.y > height + ps[i].r) {
      ps.splice(i,1);
    }
  }
}

function mousePressed() {
  let prev = ps.length;
  burst(mouseX, mouseY);
  console.log(ps.length - prev);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
