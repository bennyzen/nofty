/*
This piece serves as an elongator for more vertical space between segments or
at the end of short towers, to make more space for the roots. Too short towers
tend to clogged by roots obstructing the water outflow.
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
// let pot = cylinder({
//   r: (c.POT_INNER_DIAMETER/2) + c.WALL_THICKNESS,
//   h: c.POT_HEIGHT
// })
//   .rotateY(-50)
//   .translate([-24, 0, 14.3 + c.RING_HEIGHT])
// tube = union(tube, pot)

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
// tube = difference(
//   tube,
//   cylinder({
//     r: c.POT_INNER_DIAMETER/2,
//     h: c.POT_HEIGHT,
//     center: [true, true, false]
//   })
//     .rotateY(-50)
//     .translate([-24, 0, 14.3 + c.RING_HEIGHT])
// )

let stla = jscad.generateOutput('stla',tube)
fs.writeFileSync('./stl/middle-blind.stl', stla.asBuffer())
