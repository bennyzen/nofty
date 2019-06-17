const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

// middle
let middle = cube({size: [c.HOOK_MIDDLE, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
    .rotateZ(80)
    .translate([53.5, 31, 0])

// upper
let upper = cube({size: [30, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
    .translate([73, 65, 0])
upper = union(
  upper,
  cube({size: [15, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
    .translate([80.5, 36, 0])
)
upper = union(
  upper,
  cube({size: [27, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
    .rotateZ(90)
    .translate([86.5, 51, 0])
)

// nail
let lower = cube({size: [17, c.HOOK_THICKNESS, c.HOOK_HEIGHT], center: [true, true, false]})
  .translate([40, -4, 0])


let nail = cylinder({r1: 3, r2: 1.5, h: 7, center: [true, true, false]})
    .rotateX(-90)
    .translate([36, -3, 3])
lower = union(lower, nail)

let part = union(
  lower.translate([0, -(c.HOOK_MIDDLE - 70)/2, 0]),
  middle,
  upper.translate([0, (c.HOOK_MIDDLE - 70)/2, 0])
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/nft-baseplate-hooks.stl', stl.asBuffer())
