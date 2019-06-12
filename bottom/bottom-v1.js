const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

// part
let part = cylinder({
  r1: c.SEGMENT_OUTER_DIAMETER/2,
  r2: c.FLOW_DIAMETER/2,
  h: c.END_HEIGHT,
  center: [true, true, false]
})

// flow
part = union(
  part,
  cylinder({
    r: c.FLOW_DIAMETER/2,
    h: c.FLOW_HEIGHT,
    center: [true, true, false]
  })
    .translate([0, 0, c.END_HEIGHT])
)

// cavity
part = difference(
  part,
  cylinder({
    r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS,
    r2: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS,
    h: c.END_HEIGHT - c.WALL_THICKNESS,
    center: [true, true, false]
  })
)
part = difference(
  part,
  cylinder({
    r: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS,
    h: c.FLOW_HEIGHT + 5,
    center: [true, true, false]
  })
    .translate([0, 0, c.END_HEIGHT - 5])
)

// rope
const addRopeHolder = (part,rotation) => {
  let block = cube({size: [c.ROPE_DIAMETER+c.WALL_THICKNESS*2, c.ROPE_DIAMETER+c.WALL_THICKNESS*2, 30], center: [true, true, false]})
    .translate([20, 0, 0])
    .rotateZ(rotation)
  part = union(part,block)
  // drill hole
  part = difference(
    part,
    cylinder({r: c.ROPE_DIAMETER/2, h: 50, center: [true, true, false]})
      .translate([20, 0, 0])
      .rotateZ(rotation)
  )
  return part
}
part = addRopeHolder(part,0)
part = addRopeHolder(part,180)

// ring
part = union(
  part,
  cylinder({
    r: c.SEGMENT_OUTER_DIAMETER/2,
    h: c.RING_HEIGHT,
    center: [true, true, true]
  })
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/bottom-v1.stl', stl.asBuffer())
