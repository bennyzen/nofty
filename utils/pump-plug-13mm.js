const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

let part = cylinder({
  r1: 12.5/2,
  r2: 13.0/2,
  h: 11.5,
  center: [true, true, false]
})

part = union(
  part,
  cylinder({r: 6.5/2, h: 8, center: [true, true, false]})
    .translate([0, 0, 11.5])
)

part = difference(
  part,
  cylinder({r: 4.4/2, h: 50, center: [true, true, false]})
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/pump-plug-13mm.stl', stl.asBuffer())
