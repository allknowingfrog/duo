"use strict"

// effects instrument, pitched per note
const instrument = new Sound([0.4, 0, 220, 0, 0.08, 0.15])

const lead = new Sound([0.3, 0, 440, 0, 0.04, 0.12])
const bass = new Sound([0.5, 0, 165, 0, 0.18, 0.25])

// volume, randomness, frequency, attack, sustain, release,
// shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime,
// repeatTime, noise
const failSound = new Sound([0.6, 0, 300, 0.01, 0.25, 0.6, 0, 0, -0.6, 0, 0, 0, 0, 0.3])

// minor pentatonic phrases, null is a rest
const phrases = [
  [0, null, 3, null, 5, null, 3, null],
  [0, 3, 5, 7, 5, 3, 0, null],
  [7, 5, 7, 10, 7, 5, 3, null],
  [0, 0, 3, null, 5, 5, 3, null],
  [12, 10, 7, 5, 3, null, 0, null],
]

// phrases are transposed by these, cycling on a different length
const roots = [0, 0, 5, 3]

const beatLengthStart = 0.28
const beatLengthMin = 0.12
const beatSpeedUp = 0.004

const beatTimer = new Timer()

let step = 0
let phraseIndex = 0
let rootIndex = 0

function playChord(root, offsets, volume) {
  offsets.forEach(offset => {
    instrument.playNote(root + offset, undefined, volume)
  })
}

// major triad, an octave up
function playPass() {
  playChord(12, [0, 4, 7], 0.7)
}

// falling wail under a tritone, the most obviously wrong interval
function playFail() {
  failSound.play()
  playChord(0, [0, 6], 0.6)
}

function startMusic() {
  step = 0
  phraseIndex = 0
  rootIndex = 0

  beatTimer.set(0)
}

function updateMusic(score) {
  if (!beatTimer.elapsed()) {
    return
  }

  beatTimer.set(max(beatLengthMin, beatLengthStart - score * beatSpeedUp))

  const phrase = phrases[phraseIndex]
  const note = phrase[step]
  const root = roots[rootIndex]

  if (note !== null) {
    lead.playNote(root + note, undefined, 0.25)
  }

  if (step % 4 === 0) {
    bass.playNote(root, undefined, 0.35)
  }

  step++

  // pick a different phrase and advance the root at the end of each one
  if (step >= phrase.length) {
    step = 0
    phraseIndex = (phraseIndex + 1 + randInt(phrases.length - 1)) % phrases.length
    rootIndex = (rootIndex + 1) % roots.length
  }
}
