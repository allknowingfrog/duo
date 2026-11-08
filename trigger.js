"use strict"

// a pad that starts a game mode when every player is touching it at once
class Trigger extends EngineObject {
  constructor(pos, size, mode) {
    super(pos, size, undefined, 0, WHITE, -1)

    this.mode = mode

    this.mass = 0
  }

  touching() {
    return players.filter(player => isOverlapping(player.pos, player.size, this.pos, this.size))
  }

  update() {
    if (this.touching().length === players.length) {
      startMode(this.mode)
    }
  }

  render() {
    const fill = this.touching().length / players.length

    drawCircle(this.pos, this.size.x, WHITE.withAlpha(fill * 0.5), 0.15, WHITE)
  }
}
