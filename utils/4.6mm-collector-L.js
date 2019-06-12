const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere } = api.primitives3d

let part = difference(
  cylinder({r: 2.6, h: 15, center: [true, true, false]}).rotateX(90),
  cylinder({r: 1.4, h: 15, center: [true, true, false]}).rotateX(90)
)

let blade = cube({size: [3.7, 15, 15], center: [true, true, true]})
  .rotateZ(45)
part = difference(part,blade)

part2 = part
  .rotateZ(90)
  .rotateX(180)
  .translate([-2.65, -2.65, 0])
part = union(part,part2)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/4.6mm-collector-L.stl', stl.asBuffer())
