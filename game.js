"use strict"

const levelRows = [
  '###############################',
  '#X..#.........X#X......#.....X#',
  '#.1............#..............#',
  '#......#.....#####...#...#....#',
  '########..#..#!.....#######..##',
  '#.........#.........#!........#',
  '#....X....#.........#....X....#',
  '#........!#.........#.........#',
  '##..#######.....!#..#..########',
  '#....#...#...#####.....#......#',
  '#..............#............2.#',
  '#X.....#......X#X.........#..X#',
  '###############################',
]

const levelSize = vec2(levelRows[0].length, levelRows.length)

// in game tiles
const minSpawnDistance = 6

// in seconds
const startingTime = 30
const timeReduction = 1
const minimumTime = 0

const saveName = "duo"

const players = []
const buttons = []
const triggers = []
const spawnVecs = []

// each spawn is an index in spawnVecs
let previousSpawns = []

let score = 0
let best = 0

// null while idle; a mode has begin, update, and end
let activeMode = null

const roundTimer = new Timer()

function tileCenter(x, y) {
  return vec2(x + 0.5, y + 0.5)
}

function roundComplete() {
  return buttons.every(button => button.isOccupied())
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

  const remaining = max(0, -roundTimer.get())
  const bonus = max(minimumTime, startingTime - score * timeReduction)

  roundTimer.set(remaining + bonus)
}

const duoMode = {
  begin() {
    score = 0

    players.forEach(player => {
      buttons.push(new Button(player))
    })

    startRound()
    startMusic()
  },

  update() {
    updateMusic(score)

    if (roundComplete()) {
      score++

      playPass()
      startRound()
    } else if (roundTimer.elapsed()) {
      playFail()
      endMode()
    }
  },

  end() {
    buttons.forEach(button => button.destroy())
    buttons.length = 0

    roundTimer.unset()

    best = max(best, score)
    writeSaveData(saveName, { best })
  },
}

function startMode(mode) {
  triggers.forEach(trigger => trigger.destroy())
  triggers.length = 0

  activeMode = mode
  activeMode.begin()
}

function endMode() {
  activeMode.end()
  activeMode = null

  spawnTriggers()
}

function spawnTriggers() {
  // the map's middle spawn
  const center = tileCenter(floor(levelSize.x / 2), floor(levelSize.y / 2))

  triggers.push(new Trigger(center, vec2(2.4), duoMode))
}

function gameInit() {
  // disable automatic mapping of WASD to arrow keys
  setInputWASDEmulateDirection(false)

  // the Esc debug overlay still shows the stats line when open
  setDebugWatermark(false)

  best = readSaveData(saveName, { best: 0 }).best

  for (let row = 0; row < levelRows.length; row++) {
    for (let x = 0; x < levelRows[row].length; x++) {
      const char = levelRows[row][x]
      const y = levelRows.length - 1 - row

      if (char === "#") {
        new Wall(tileCenter(x, y))
      } else if (char === "X") {
        spawnVecs.push(tileCenter(x, y))
      } else if (char === "!") {
        new Boost(tileCenter(x, y))
      } else if (char === "1") {
        players[0] = new Player(tileCenter(x, y), hsl(0.6, 1, 0.65), ["KeyW", "KeyS", "KeyA", "KeyD"], 0)
      } else if (char === "2") {
        players[1] = new Player(tileCenter(x, y), hsl(0.33, 0.6, 0.45), ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], 1)
      }
    }
  }

  spawnTriggers()

  setCameraPos(levelSize.scale(0.5))
  setCameraScale(40)
}

function gameUpdate() {
  if (activeMode) {
    activeMode.update()
  }
}

function pausePressed() {
  // 9 is Start in the standard gamepad mapping
  return keyWasPressed("Space") || gamepadWasPressed(9, 0) || gamepadWasPressed(9, 1)
}

function gameUpdatePost() {
  // gameUpdate is skipped while paused, so the toggle has to be read here
  if (pausePressed()) {
    setPaused(!getPaused())
  }
}

function gameRender() {
  drawRect(levelSize.scale(0.5), levelSize, rgb(0.12, 0.12, 0.15))
}

function gameRenderPost() {
  const center = mainCanvasSize.x / 2

  drawTextScreen(ceil(max(0, -roundTimer.get())).toString(), vec2(center, 40), 40)
  drawTextScreen(`SCORE ${score}`, vec2(100, 40), 24)
  drawTextScreen(`BEST ${best}`, vec2(mainCanvasSize.x - 100, 40), 24)

  if (getPaused()) {
    drawTextScreen("PAUSED", vec2(center, 85), 24)
  }
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost)
