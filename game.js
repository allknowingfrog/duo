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

// in game tiles
const minSpawnDistance = 6

// in seconds
const startingTime = 13
const timeReduction = 0.25
const minimumTime = 4

const startingLives = 3

const players = []
const buttons = []
const spawnVecs = []

// each spawn is an index in spawnVecs
let previousSpawns = []

let score = 0
let lives = startingLives

// "splash", "playing", or "over"
let gameState = "splash"

const roundTimer = new Timer()

function tileCenter(x, y) {
  return vec2(x + 0.5, y + 0.5)
}

function roundComplete() {
  return buttons.every(button => button.isOccupied())
}

function roundTime() {
  return max(minimumTime, startingTime - score * timeReduction)
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

  const spare = max(0, -roundTimer.get())

  roundTimer.set(spare + roundTime())
}

function startRun() {
  score = 0
  lives = startingLives
  gameState = "playing"

  setPaused(false)
  startRound()
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

  setPaused(true)
}

function gameUpdate() {
  if (roundComplete()) {
    score++

    startRound()
  } else if (roundTimer.elapsed()) {
    lives--

    if (lives > 0) {
      startRound()
    } else {
      gameState = "over"

      setPaused(true)
    }
  }
}

function gameUpdatePost() {
  // gameUpdate is skipped while paused, so space has to be read here
  if (!keyWasPressed("Space")) {
    return
  }

  if (gameState === "playing") {
    setPaused(!getPaused())
  } else {
    startRun()
  }
}

function gameRender() {
  drawRect(levelSize.scale(0.5), levelSize, rgb(0.12, 0.12, 0.15))
}

function gameRenderPost() {
  const center = mainCanvasSize.x / 2

  if (gameState === "splash") {
    drawTextScreen("DUO", vec2(center, 40), 40)
    drawTextScreen("WASD  /  ARROWS", vec2(center, 85), 24)
    drawTextScreen("SPACE TO START", vec2(center, 125), 24)

    return
  }

  if (gameState === "over") {
    drawTextScreen(`GAME OVER - SCORE ${score}`, vec2(center, 40), 40)
    drawTextScreen(`SPACE TO RESTART`, vec2(center, 85), 24)

    return
  }

  drawTextScreen(max(0, -roundTimer.get()).toFixed(1), vec2(center, 40), 40)
  drawTextScreen(`SCORE ${score}`, vec2(100, 40), 24)
  drawTextScreen(`LIVES ${lives}`, vec2(mainCanvasSize.x - 100, 40), 24)

  if (getPaused()) {
    drawTextScreen("PAUSED", vec2(center, 85), 24)
  }
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost)
