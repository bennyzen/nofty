/*
v2
Make the inflow compatible with a 4.6mm Gardena Micro Drip tube. v1 had two
major flaws: tube was too wide and the angle of the inflow off. maybe the next
version will include some kind of flow helper, to really get the incoming water
to the walls, preventing it from falling strainght through the middle.
*/

const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

// let outflow = difference(
//   cylinder({r: c.FLOW_DIAMETER/2, h: c.FLOW_HEIGHT, center: [true, true, false]}),
//   cylinder({r: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.FLOW_HEIGHT, center: [true, true, false]})
// ).translate([0, 0, c.END_HEIGHT])

// let cone = difference(
//   cylinder({r1: c.TOP_DIAMETER/2, r2: c.FLOW_DIAMETER/2, h: c.END_HEIGHT, center: [true, true, false]}),
//   cylinder({r1: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, r2: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.END_HEIGHT, center: [true, true, false]})
// )
// let part = union(outflow, cone)

let ring = difference(
  cylinder({r: c.TOP_DIAMETER/2, h: c.RING_HEIGHT, center: [true, true, false]}),
  cylinder({r: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, h: c.RING_HEIGHT, center: [true, true, false]})
)
let part = ring

// ceiling
part = union(
  part,
  cylinder({r: c.TOP_DIAMETER/2, h: c.WALL_THICKNESS, center: [true, true, false]})
    .translate([0, 0, c.RING_HEIGHT])
)

// add a diverter, to make the water flow along the walls
part = union(
  part,
  cylinder({r1: c.TOP_DIAMETER/2 - c.WALL_THICKNESS*2, r2: 1, h: 5, center: [true, true, false]})
)
part = union(
  part,
  cube({size: [8, c.TOP_DIAMETER - c.WALL_THICKNESS, c.WALL_THICKNESS], center: [true, true, false]}),
  cube({size: [8, c.TOP_DIAMETER - c.WALL_THICKNESS, c.WALL_THICKNESS], center: [true, true, false]})
    .rotateZ(90)
)

let addRopeHolders = (part,rotation) => {
  let block = cube({size: [c.ROPE_DIAMETER+6, c.ROPE_DIAMETER+6, c.RING_HEIGHT], center: [true, true, false]})
    .translate([20, 0, 0])
    .rotateZ(rotation)
  part = union(part,block)
  part = difference(
    part,
    cylinder({r: c.ROPE_DIAMETER/2, h: c.RING_HEIGHT+c.WALL_THICKNESS, center: [true, true, false]})
      .translate([20, 0, 0])
      .rotateZ(rotation)
  )
  return part
}
part = addRopeHolders(part,0)
part = addRopeHolders(part,180)

// add inflow block
part = union(
  part,
  cube({size: [12, c.TOP_DIAMETER/2+10, c.RING_HEIGHT], center: [true, true, false]})
    .translate([0, -c.TOP_DIAMETER/2+25, c.RING_HEIGHT])
)

// drill sidehole
part = difference(
  part,
  cylinder({r: 3, h: c.TOP_DIAMETER/2+10, center: [true, true, false]})
    .rotateX(90)
    .translate([0, 6, c.RING_HEIGHT + 7])
)
part = difference(
  part,
  cylinder({r: 3, h: 10, center: [true, true, false]})
    .translate([0, 0, 9])
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/top-v3.stl', stl.asBuffer())
