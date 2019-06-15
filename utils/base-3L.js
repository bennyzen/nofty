const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

let part = difference(
  cube({size: [c.BASE_SIDE, c.BASE_SIDE, c.BASE_HEIGHT], center: [true, true, false]}),
  cube({size: [c.BASE_SIDE-(c.WALL_THICKNESS*2), c.BASE_SIDE-(c.WALL_THICKNESS*2), c.BASE_HEIGHT-c.WALL_THICKNESS], center: [true, true, false]})
    .translate([0, 0, c.WALL_THICKNESS])
)

let h = (1000000000 / 333.333) / ((c.BASE_SIDE - (c.WALL_THICKNESS*2)) * (c.BASE_SIDE - (c.WALL_THICKNESS*2)))
  + c.WALL_THICKNESS

// 3L mark inside base
part = union(
  part,
  cube({size: [50, 0.8, 1], center: [true, true, false]})
    .translate([0, c.BASE_SIDE/2-c.WALL_THICKNESS, h])
)
let l = api.text.vector_text(0, 0, '3L')
let o = []
l.forEach(pl=>{
  o.push(rectangular_extrude(pl, {w:2,h:2}))
})
o = union(o)
part = union(
  part,
  o
    .rotateX(90)
    .translate([-20, c.BASE_SIDE/2-0.8, c.WALL_THICKNESS + 45])
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/base-3L.stl', stl.asBuffer())
