"use strict"

class Button extends EngineObject {
  constructor(player) {
    super(vec2(), vec2(0.7), undefined, 0, player.color, -1)

    this.player = player

    this.mass = 0
  }

  isOccupied() {
    return isOverlapping(this.player.pos, vec2(), this.pos, this.size)
  }

  render() {
    if (this.isOccupied()) {
      drawCircle(this.pos, this.size.x, this.color.lerp(WHITE, 0.5))
    } else {
      drawCircle(this.pos, this.size.x, CLEAR_WHITE, 0.1, this.color)
    }
  }
}
