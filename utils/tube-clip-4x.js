const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

// ring_small
let ring_small = difference(
  cylinder({r: 6, h: 3, center: [true, true, false]}),
  cylinder({r: 4, h: 3, center: [true, true, false]})
)

// large ring
let ring_large = difference(
  cylinder({r: 10,  h: 3, center: [true, true, false]}),
  cylinder({r: 8, h: 3, center: [true, true, false]})
)


let part = union(
    ring_small.translate([-3, 0, 0]),
    ring_large.translate([8, -9, 0]),
    ring_large.translate([8,  9, 0]),
    ring_large.translate([26,  -9, 0]),
    ring_large.translate([26,  9, 0]),
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/tube-clip-x4.stl', stl.asBuffer())
