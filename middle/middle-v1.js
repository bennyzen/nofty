const c = require('./../config.js')
const fs = require('fs')
const jscad = require('@jscad/openjscad')
const api = require('@jscad/scad-api')
const { cube, cylinder, sphere } = api.primitives3d
const { union, difference, intersection } = api.booleanOps

// tube
let tube = cylinder({
  r: c.SEGMENT_OUTER_DIAMETER / 2,
  h: c.SEGMENT_HEIGHT
})

// pot
let pot = cylinder({
  r: (c.POT_INNER_DIAMETER/2) + c.WALL_THICKNESS,
  h: c.POT_HEIGHT
})
  .rotateY(-50)
  .translate([-26, 0, 14.3])
tube = union(tube, pot)

// hole tube
tube = difference(
  tube,
  cylinder({
    r: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS,
    h: c.SEGMENT_HEIGHT,
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
    .translate([-26, 0, 14.3])
)

// add lower ring
let ring = cylinder({
  r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS - c.RING_INSET,
  r2: c.SEGMENT_OUTER_DIAMETER/2 - .5,
  h: c.RING_HEIGHT,
  center: [true, true, false]
})
tube = union(
  tube.translate([0, 0, c.RING_HEIGHT-.5]),
  ring
)
tube = difference(
  tube,
  cylinder({
    r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS*2 - c.RING_INSET,
    r2: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS,
    h: c.RING_HEIGHT,
    center: [true, true, false]
  })
)

let stla = jscad.generateOutput('stla',tube)
fs.writeFileSync('stl/segment.stl', stla.asBuffer())
