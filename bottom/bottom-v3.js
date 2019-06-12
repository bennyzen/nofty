/*
This is the endpiece of the hydro tower. All returning water is captured into a
central tube and flows back into the tank. The last middle semgent should snap
into this endpiece. While printing, use 'Layer Time' to let the short, upper
layers cool down accordingly.

v3
Removes the holes for the rope from the outside and places them on the inside,
making the endpiece waterproof. Otherwise the water would run along the ropes
and finally leak through the sideholes, instead of going back through the
central pipe. The edges on the outside remain visible, so the orientation of
the rope is always clear.
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
  cylinder({r1: c.SEGMENT_OUTER_DIAMETER/2, r2: c.FLOW_DIAMETER/2, h: c.END_HEIGHT, center: [true, true, false]}),
  cylinder({r1: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS, r2: c.FLOW_DIAMETER/2 - c.WALL_THICKNESS, h: c.END_HEIGHT, center: [true, true, false]})
)
let part = union(outflow, cone)

let ring = difference(
  cylinder({r: c.SEGMENT_OUTER_DIAMETER/2, h: c.RING_HEIGHT, center: [true, true, false]}),
  cylinder({r: c.SEGMENT_OUTER_DIAMETER/2 - c.WALL_THICKNESS, h: c.RING_HEIGHT, center: [true, true, false]})
)
part = union(part.translate([0, 0, c.RING_HEIGHT]), ring)

let addRopeHolders = (part,rotation) => {
  let block = cube({size: [c.ROPE_DIAMETER, c.ROPE_DIAMETER+6, 35], center: [true, true, false]})
    .translate([20, 0, 0])
    .rotateZ(rotation)
  part = union(part,block)
  // some kind of 'knock-of-the-buildplate' protection
  part = union(
    part,
    cube({size: [48, c.ROPE_DIAMETER+6, c.WALL_THICKNESS], center: [true, true, false]})
  )
  part = difference(
    part,
    cylinder({r: c.ROPE_DIAMETER/2, h: 20, center: [true, true, false]})
      .rotateY(90)
      .translate([10, 0, 6.5])
      .rotateZ(rotation)
  )
  return part
}
part = addRopeHolders(part,0)
part = addRopeHolders(part,180)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/bottom-v3.stl', stl.asBuffer())
