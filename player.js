"use strict"

class Player extends EngineObject {
  constructor(pos, color, keys) {
    super(pos, vec2(0.7))

    this.color = color
    this.keys = keys

    // world units per frame
    this.topSpeed = 0.06
    this.acceleration = 0.006
    this.driveDamping = 1 - this.acceleration / (this.topSpeed + this.acceleration)
    this.brakeDamping = 1 - (1 - this.driveDamping) * 1.5

    // only collide with solid objects
    this.setCollision(true, false, false, false)
  }

  update() {
    // clampLength calculates diagonal movement (instead of applying both axes)
    const dir = keyDirection(...this.keys).clampLength(1)

    this.damping = dir.length() ? this.driveDamping : this.brakeDamping

    this.applyAcceleration(dir.scale(this.acceleration))
  }
}
