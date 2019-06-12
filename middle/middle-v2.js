/*
This version is a cylindrical cone. The cones should stick into each other,
allowing the nutrient solution to build up a vertical film (NFT conecept) down
along the middle segments. V1 was flawed, as it had too much bevel and the
nutrient was falling down as drops in the middle of the tube.
*/

const c = require('./../config.js')
const fs = require('fs')
const jscad = require('@jscad/openjscad')
const api = require('@jscad/scad-api')
const { cube, cylinder, sphere } = api.primitives3d
const { union, difference, intersection } = api.booleanOps

// tube
let tube = cylinder({
  r1: c.SEGMENT_OUTER_DIAMETER / 2 - c.RING_INSET + c.WALL_THICKNESS,
  r2: c.SEGMENT_OUTER_DIAMETER / 2,
  h: c.SEGMENT_HEIGHT + c.RING_HEIGHT
})

// pot
let pot = cylinder({
  r: (c.POT_INNER_DIAMETER/2) + c.WALL_THICKNESS,
  h: c.POT_HEIGHT
})
  .rotateY(-50)
  .translate([-24, 0, 14.3 + c.RING_HEIGHT])
tube = union(tube, pot)

// hole tube
tube = difference(
  tube,
  cylinder({
    r1: c.SEGMENT_OUTER_DIAMETER / 2 - c.RING_INSET,
    r2: c.SEGMENT_OUTER_DIAMETER / 2 - c.WALL_THICKNESS,
    h: c.SEGMENT_HEIGHT + c.RING_HEIGHT,
    center: [true, true, false]
  })
)

// hole pot
tube = difference(
  tube,
  cylinder({
    r: c.POT_INNER_DIAMETER/2,
    h: c.POT_HEIGHT,
    center: [true, true, false]
  })
    .rotateY(-50)
    .translate([-24, 0, 14.3 + c.RING_HEIGHT])
)

// add lower ring
// let ring = cylinder({
//   r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS - c.RING_INSET,
//   r2: c.SEGMENT_OUTER_DIAMETER/2 - .5,
//   h: c.RING_HEIGHT,
//   center: [true, true, false]
// })
// tube = union(
//   tube.translate([0, 0, c.RING_HEIGHT-.5]),
//   ring
// )
// tube = difference(
//   tube,
//   cylinder({
//     r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS*2 - c.RING_INSET,
//     r2: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS,
//     h: c.RING_HEIGHT,
//     center: [true, true, false]
//   })
// )

let stla = jscad.generateOutput('stla',tube)
fs.writeFileSync('./stl/middle-v2.stl', stla.asBuffer())
