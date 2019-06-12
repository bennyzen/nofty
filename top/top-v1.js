const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

let outflow = difference(
  cylinder({r: c.FLOW_DIAMETER/2, h: c.FLOW_HEIGHT, center: [true, true, false]}),
  cylinder({r: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.FLOW_HEIGHT, center: [true, true, false]})
).translate([0, 0, c.END_HEIGHT])

let cone = difference(
  cylinder({r1: c.TOP_DIAMETER/2, r2: c.FLOW_DIAMETER/2, h: c.END_HEIGHT, center: [true, true, false]}),
  cylinder({r1: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, r2: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.END_HEIGHT, center: [true, true, false]})
)
let part = union(outflow, cone)

let ring = difference(
  cylinder({r: c.TOP_DIAMETER/2, h: c.RING_HEIGHT, center: [true, true, false]}),
  cylinder({r: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, h: c.RING_HEIGHT, center: [true, true, false]})
)
part = union(part.translate([0, 0, c.RING_HEIGHT]), ring)

let addRopeHolders = (part,rotation) => {
  let block = cube({size: [c.ROPE_DIAMETER+6, c.ROPE_DIAMETER+6, 15], center: [true, true, false]})
    .translate([20, 0, 24])
    .rotateZ(rotation)
  part = union(part,block)
  part = difference(
    part,
    cylinder({r: c.ROPE_DIAMETER/2, h: 25, center: [true, true, false]})
      .translate([20, 0, 20])
      .rotateZ(rotation)
  )
  return part
}
part = addRopeHolders(part,0)
part = addRopeHolders(part,180)

// fix extreme overhangs by removing the inner parts of the rope holders
part = difference(
  part,
  cylinder({r1: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, r2: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.END_HEIGHT, center: [true, true, false]})
    .translate([0, 0, c.RING_HEIGHT])
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/top-v1.stl', stl.asBuffer())
