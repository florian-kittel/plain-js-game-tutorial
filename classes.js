
class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1 },
    sprites = {}
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.init();
    this.width = 48;
    this.sprites = sprites;
    this.moving = false;
  }

  init() {
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    );

    if (!this.moving ) {
      this.frames.val = 0;
      this.frames.elapsed = 0;
      return;
    }

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed === 1 || this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}