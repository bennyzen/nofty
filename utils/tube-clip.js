const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

let part = union(
    difference(
      cylinder({r: 6, h: 3, center: [true, true, false]}).translate([-6, 0, 0]),
      cylinder({r: 4, h: 3, center: [true, true, false]}).translate([-6, 0, 0])
    ),
    difference(
      cylinder({r: 10,  h: 3, center: [true, true, false]}).translate([8, 0, 0]),
      cylinder({r: 7.5, h: 3, center: [true, true, false]}).translate([8, 0, 0])
    )

)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/tube-clip.stl', stl.asBuffer())
