console.log('Hello Game');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const offset = {
  x: -686,
  y: -660,
}

const collisionMap = [];
for (let i = 0; i < collisions.data.length; i += 70) {
  collisionMap.push(collisions.data.slice(i, 70 + i));
}


const boundaries = [];

collisionMap.forEach((row, indexRow) => {
  row.forEach((symbol, indexSymbol) => {
    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: indexSymbol * Boundary.width + offset.x,
            y: indexRow * Boundary.height + offset.y
          }
        })
      )
    }
  })
})
// console.log(boundaries);


context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/game-map.png';

const forgroundImage = new Image();
forgroundImage.src = './img/game-map-fg.png';

const playerImageDown = new Image();
playerImageDown.src = './img/playerDown.png';

const playerImageUp = new Image();
playerImageUp.src = './img/playerUp.png';

const playerImageLeft = new Image();
playerImageLeft.src = './img/playerLeft.png';

const playerImageRight = new Image();
playerImageRight.src = './img/playerRight.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 198 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImageDown,
  frames: {
    max: 4
  },
  sprites: {
    down: playerImageDown,
    left: playerImageLeft,
    up: playerImageUp,
    right: playerImageRight,
  }
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image,
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: forgroundImage,
})

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
}

let lastKey = '';

const testBoundary = new Boundary({
  position: {
    x: 432,
    y: 416
  }
})

const movables = [background, foreground, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  // console.log(rectangle1.position.x, rectangle1.width);
  // console.log(rectangle1.position.x + rectangle1.width, rectangle2.position.x);
  return (
    rectangle1.position.x + rectangle1.width > rectangle2.position.x &&
    rectangle1.position.x < rectangle2.position.x + rectangle2.width && // geht
    rectangle1.position.y + rectangle1.height > rectangle2.position.y &&
    rectangle1.position.y < rectangle2.position.y + rectangle2.height // geht
  )
}

const animate = () => {
  window.requestAnimationFrame(animate);
  background.draw();
  // testBoundary.draw();

  // boundaries.forEach(bondary => {
  //   bondary.draw();
  // });

  player.draw();
  foreground.draw();


  // console.log(player.position.x + player.width, testBoundary.position.x);
  // if (rectangularCollision({ rectangle1: player, rectangle2: testBoundary })) {
  //   console.log('colliding');
  // }

  const getPlayer = () => {
    return {
      ...player,
      width: 46,
      height: 46,
      position: {
        x: player.position.x - 1,
        y: player.position.y + 20
      }
    };
  };

  const movingDistance = 4;
  player.moving = false;
  // Oben
  if (keys.w.pressed && lastKey === 'w') {
    let moving = true;
    player.moving = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: getPlayer(),
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + movingDistance,
            }
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach(movable => movable.position.y += movingDistance);
  }

  // Unten
  else if (keys.s.pressed && lastKey === 's') {
    let moving = true;
    player.moving = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: getPlayer(),
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - movingDistance,
            }
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach(movable => movable.position.y -= movingDistance);
  }

  // Links
  else if (keys.a.pressed && lastKey === 'a') {
    let moving = true;
    player.moving = true;
    player.image = player.sprites.left;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: getPlayer(),
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + movingDistance,
              y: boundary.position.y,
            }
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach(movable => movable.position.x += movingDistance);
  }

  // Rechts
  else if (keys.d.pressed && lastKey === 'd') {
    let moving = true;
    player.moving = true;
    player.image = player.sprites.right;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: getPlayer(),
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - movingDistance,
              y: boundary.position.y,
            }
          }
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach(movable => movable.position.x -= movingDistance);
  }
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.w.pressed = true;
      lastKey = 'w';
      break;

    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = true;
      lastKey = 'a';
      break;

    case 's':
    case 'ArrowDown':
      keys.s.pressed = true;
      lastKey = 's';
      break;

    case 'd':
    case 'ArrowRight':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      keys.w.pressed = false;
      break;

    case 'a':
    case 'ArrowLeft':
      keys.a.pressed = false;
      break;

    case 's':
    case 'ArrowDown':
      keys.s.pressed = false;
      break;

    case 'd':
    case 'ArrowRight':
      keys.d.pressed = false;
      break;
  }
});

// console.log(context);