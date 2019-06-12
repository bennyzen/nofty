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

// add a diverter, to make the water flow along the walls
part = union(
  part,
  cylinder({r1: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, r2: 1, h: 5, center: [true, true, false]})
)
part = union(
  part,
  cube({size: [8, c.TOP_DIAMETER - c.WALL_THICKNESS, c.WALL_THICKNESS], center: [true, true, false]}),
  cube({size: [8, c.TOP_DIAMETER - c.WALL_THICKNESS, c.WALL_THICKNESS], center: [true, true, false]})
    .rotateZ(90)
)

let addRopeHolders = (part,rotation) => {
  let block = cube({size: [c.ROPE_DIAMETER+6, c.ROPE_DIAMETER+6, 40], center: [true, true, false]})
    .translate([20, 0, 0])
    .rotateZ(rotation)
  part = union(part,block)
  part = difference(
    part,
    cylinder({r: c.ROPE_DIAMETER/2, h: 50, center: [true, true, false]})
      .translate([20, 0, 0])
      .rotateZ(rotation)
  )
  return part
}
part = addRopeHolders(part,0)
part = addRopeHolders(part,180)


let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/top-v2.stl', stl.asBuffer())
