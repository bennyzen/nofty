/*
v2
Make the inflow compatible with a 4.6mm Gardena Micro Drip tube. v1 had two
major flaws: tube was too wide and the angle of the inflow off. maybe the next
version will include some kind of flow helper, to really get the incoming water
to the walls, preventing it from falling strainght through the middle.

v3

v4 - 19.06.2019
Previous versions suffered from unequal distribution of nutrient solution along
the walls. It has to do with the tilt of the tower. From a practical point of
view, we cannot keep the towers perfectly straight. Minimal lateral tilt results
in one side not being fed nutrient. The blocks get dry and small plants, that do
not yet have elongated roots, will probably starve. Manual intervention during
the first days may be necessary!

By forcing the nutrient solution into predefined, smaller channels we try to
reach more coverage of the tube inner walls. Tilt may still be a problem. We'll
try to add a hook under the last piece, so we can append a weight to keep the
whole tube straight and protected against wind.

Further, we could add some handles to pull off the cover from the tube only
using the fingers and without any tool. Till now, I always had to use a screw
driver to pull the top off again, once plugged into the first middle piece.
*/

const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

// ring
let ring = difference(
  cylinder({r: c.TOP_DIAMETER/2, h: c.RING_HEIGHT, center: [true, true, false]}),
  cylinder({r: c.TOP_DIAMETER/2 - c.WALL_THICKNESS, h: c.RING_HEIGHT, center: [true, true, false]})
)
let part = ring

// floor
part = union(
  part,
  cylinder({r: c.TOP_DIAMETER/2, h: c.RING_HEIGHT+c.WALL_THICKNESS, center: [true, true, false]})
)

// ceiling
part = union(
  part,
  cylinder({r: c.TOP_DIAMETER/2, h: c.WALL_THICKNESS, center: [true, true, false]})
    .translate([0, 0, c.RING_HEIGHT])
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

// drill upper sidehole
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

// drill 4 outflow holes
let h_hole = cylinder({r: 1.5, h: c.TOP_DIAMETER-(c.WALL_THICKNESS*2+6), center: [true, true, false]})
  .rotateX(90)
  .translate([0, c.TOP_DIAMETER/2-5, 8])
  .rotateZ(45)
let v_hole = cylinder({r: 2.0, h: 8, center: [true, true, false]})
  .translate([c.TOP_DIAMETER/2-5, 0, 0])
  .rotateZ(45)
h_hole = union(
  h_hole,
  v_hole,
  v_hole.rotateZ(180)
)
part = difference(
  part,
  h_hole,
  h_hole.rotateZ(90)
)

// easy pull-off finger hole (20mm)
part = union(
  part,
  cube({size: [12, 20+(2*6), 20+6], center: [true, true, false]})
    .translate([0, -c.TOP_DIAMETER/2+25, c.RING_HEIGHT*2])
)
part = difference(
  part,
  cylinder({r: 10, h: 12, center: [true, true, false]})
    .rotateY(90)
    .translate([-6, -12.5, 36])
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/top-v4.stl', stl.asBuffer())
