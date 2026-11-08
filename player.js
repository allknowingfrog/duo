"use strict"

class Player extends EngineObject {
  constructor(pos, color, keys, pad) {
    super(pos, vec2(0.7))

    this.color = color
    this.keys = keys
    this.pad = pad

    // world units per frame
    this.topSpeed = 0.06
    this.acceleration = 0.006
    this.driveDamping = 1 - this.acceleration / (this.topSpeed + this.acceleration)
    this.brakeDamping = 1 - (1 - this.driveDamping) * 1.5

    this.boostTimer = new Timer()

    // collide with walls and each other
    this.setCollision(true, true, false, false)
  }

  boost() {
    this.boostTimer.set(boostDuration)
  }

  update() {
    // clampLength calculates diagonal movement (instead of applying both axes)
    const dir = keyDirection(...this.keys)
      .add(gamepadStick(0, this.pad))
      .add(gamepadStick(1, this.pad))
      .clampLength(1)

    this.damping = dir.length() ? this.driveDamping : this.brakeDamping

    // damping is unchanged, so scaling acceleration scales top speed with it
    const acceleration = this.boostTimer.active() ? this.acceleration * boostFactor : this.acceleration

    this.applyAcceleration(dir.scale(acceleration))
  }

  render() {
    const color = this.boostTimer.active() ? this.color.lerp(WHITE, 0.4) : this.color

    drawRect(this.pos, this.size, color)
  }
}
