"use strict"

class Player extends EngineObject {
  constructor(pos, color, keys) {
    super(pos, vec2(0.7))

    this.color = color
    this.keys = keys

    // world units per frame
    this.speed = 0.06

    // only collide with solid objects
    this.setCollision(true, false, false, false)
  }

  update() {
    const dir = keyDirection(...this.keys)

    // calculate diagonal movement instead of applying both axes
    this.velocity = dir.clampLength(1).scale(this.speed)
  }
}
