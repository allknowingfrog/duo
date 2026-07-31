"use strict"

class Wall extends EngineObject {
  constructor(pos) {
    super(pos, vec2(1), undefined, 0, rgb(0.35, 0.35, 0.42))

    // static, no physics updates, no tile or raycast collision
    this.mass = 0
    this.setCollision(true, true, false, false)
  }
}
