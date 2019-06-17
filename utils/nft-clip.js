const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

let part = cube({size: [c.HOOK_THICKNESS, 40, c.HOOK_HEIGHT], center: [true, true, false]})
part = union(
  part,
  part.translate([c.HOOK_THICKNESS + 4, 0, 0])
)
part = union(
  part,
  cube({size: [2*c.HOOK_THICKNESS+4, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
    .translate([3.6, 20, 0])
)
let tube = difference(
  cylinder({r: 3.5+c.WALL_THICKNESS, h: 12, center: [true, true, false]}),
  cylinder({r: 3.5, h: 12, center: [true, true, false]})
)
  .rotateX(90)
  .translate([13, 0, 5.5])
part = union(part,tube)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/nft-clip.stl', stl.asBuffer())
