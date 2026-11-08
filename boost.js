"use strict"

const boostFactor = 1.3

// in seconds
const boostDuration = 3

class Boost extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5))

    this.mass = 0
  }

  // hidden: players find it by the color change when they hit it
  render() {}

  update() {
    players.forEach(player => {
      if (isOverlapping(player.pos, player.size, this.pos, this.size)) {
        player.boost()
      }
    })
  }
}
