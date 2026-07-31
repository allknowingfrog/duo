"use strict"

const levelRows = [
  '####################',
  '#1.................#',
  '#..................#',
  '#.........#........#',
  '#.........#........#',
  '#.........#........#',
  '#.........#........#',
  '#..................#',
  '#.................2#',
  '####################',
]

const levelSize = vec2(levelRows[0].length, levelRows.length)

const players = []

function tileCenter(x, y) {
  return vec2(x + 0.5, y + 0.5)
}

function gameInit() {
  // disable automatic mapping of WASD to arrow keys
  setInputWASDEmulateDirection(false)

  for (let row = 0; row < levelRows.length; row++) {
    for (let col = 0; col < levelRows[row].length; col++) {
      const char = levelRows[row][col]
      const y = levelRows.length - 1 - row

      if (char === "#") {
        new Wall(tileCenter(col, y))
      } else if (char === "1") {
        players[0] = new Player(tileCenter(col, y), rgb(0.3, 0.6, 1), ["KeyW", "KeyS", "KeyA", "KeyD"])
      } else if (char === "2") {
        players[1] = new Player(tileCenter(col, y), rgb(1, 0.55, 0.2), ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"])
      }
    }
  }

  setCameraPos(levelSize.scale(0.5))
  setCameraScale(40)
}

function gameUpdate() {
  return
}

function gameUpdatePost() {
  return
}

function gameRender() {
  drawRect(levelSize.scale(0.5), levelSize, rgb(0.12, 0.12, 0.15))
}

function gameRenderPost() {
  drawTextScreen("WASD / ARROWS", vec2(mainCanvasSize.x / 2, 30), 24)
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost)
