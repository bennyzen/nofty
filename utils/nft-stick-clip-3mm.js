const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

let part = cube({
  size: [c.NFT_COVER_HEIGHT + 2*c.HOOK_THICKNESS, c.HOOK_THICKNESS, c.HOOK_HEIGHT],
  center: [true, true, false]
})

let leg = cube({size: [c.HOOK_THICKNESS, 32, c.HOOK_HEIGHT], center: [false, false, false]})

part = union(
  part,
  leg.translate([c.HOOK_THICKNESS/2, 0, 0]),
  leg.translate([-c.HOOK_THICKNESS*1.5, 0, 0]),
  leg.translate([c.HOOK_THICKNESS/2, 0, -c.HOOK_HEIGHT]).rotateX(180)
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/nft-stick-clip-3mm.stl', stl.asBuffer())
