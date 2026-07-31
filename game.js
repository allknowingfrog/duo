"use strict"

const levelRows = [
  '###############################',
  '#X..#.........X#X......#.....X#',
  '#.1............#..............#',
  '#......#.....#####...#...#....#',
  '########..#..#......#######..##',
  '#.........#.........#.........#',
  '#....X....#....X....#....X....#',
  '#.........#.........#.........#',
  '##..#######......#..#..########',
  '#....#...#...#####.....#......#',
  '#..............#............2.#',
  '#X.....#......X#X.........#..X#',
  '###############################',
]

const levelSize = vec2(levelRows[0].length, levelRows.length)

const minSpawnDistance = 6

const players = []
const buttons = []
const spawnVecs = []

// each spawn is an index in spawnVecs
let previousSpawns = []

function tileCenter(x, y) {
  return vec2(x + 0.5, y + 0.5)
}

function startRound() {
  const taken = []

  buttons.forEach(button => {
    const far = []
    const near = []

    for (let i = 0; i < spawnVecs.length; i++) {
      if (previousSpawns.includes(i) || taken.includes(i)) {
        continue
      }

      if (spawnVecs[i].distance(button.player.pos) >= minSpawnDistance) {
        far.push(i)
      } else {
        near.push(i)
      }
    }

    const options = far.length ? far : near

    const spawn = options[randInt(options.length)]

    taken.push(spawn)

    button.pos = spawnVecs[spawn].copy()
  })

  previousSpawns = taken
}

function gameInit() {
  // disable automatic mapping of WASD to arrow keys
  setInputWASDEmulateDirection(false)

  for (let row = 0; row < levelRows.length; row++) {
    for (let x = 0; x < levelRows[row].length; x++) {
      const char = levelRows[row][x]
      const y = levelRows.length - 1 - row

      if (char === "#") {
        new Wall(tileCenter(x, y))
      } else if (char === "X") {
        spawnVecs.push(tileCenter(x, y))
      } else if (char === "1") {
        players[0] = new Player(tileCenter(x, y), hsl(0.6, 1, 0.65), ["KeyW", "KeyS", "KeyA", "KeyD"])
      } else if (char === "2") {
        players[1] = new Player(tileCenter(x, y), hsl(0.33, 0.6, 0.45), ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"])
      }
    }
  }

  players.forEach(player => {
    buttons.push(new Button(player))
  })

  startRound()

  setCameraPos(levelSize.scale(0.5))
  setCameraScale(40)
}

function gameUpdate() {
  if (keyWasPressed("Space")) {
    startRound()
  }
}

function gameUpdatePost() {
  return
}

function gameRender() {
  drawRect(levelSize.scale(0.5), levelSize, rgb(0.12, 0.12, 0.15))
}

function gameRenderPost() {
  drawTextScreen("SPACE to reroll", vec2(mainCanvasSize.x / 2, 30), 24)
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost)
