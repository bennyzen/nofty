const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

let fn = 128

let part = cube({
  size: [c.BASE_COVER_WIDTH, c.BASE_COVER_LENGTH, 100],
  center: [true, true, false],
  radius: 2,
  roundradius: 0.9,
  resolution: 128,
})
part = difference(
  part,
  cube({
    size: [
      c.BASE_COVER_WIDTH-(2*c.WALL_THICKNESS),
      c.BASE_COVER_LENGTH-(2*c.WALL_THICKNESS),
      100
    ],
    center: [true, true, false],
    radius: 2,
    roundradius: 0.9,
    resolution: 128,
  })
    .translate([0, 0, c.WALL_THICKNESS])
)

let selection = cube({size: [200, 200, 20], center: [true, true, false]})
part = intersection(part,selection)

// add nutrient hole (7mm)
part = difference(
  part,
  cylinder({r: 3.5, h: 25, center: [true, true, false]})
    .translate([0, 75, 0]),
  cube({size: [7, 20, 25], center: [true, true, false]})
    .translate([0, 85, 0])
)

// add backflow holes (18mm)
part = difference(
  part,
  // cylinder({r: 9, h: 25, center: [true, true, false]}).translate([-60, 0, 0]),
  cylinder({r: 9, h: 25, center: [true, true, false]}).translate([-30, 0, 0]),
  // cylinder({r: 9, h: 25, center: [true, true, false]}).translate([  0, 0, 0]),
  cylinder({r: 9, h: 25, center: [true, true, false]}).translate([ 30, 0, 0]),
  // cylinder({r: 9, h: 25, center: [true, true, false]}).translate([ 60, 0, 0]),
)

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/nft-base-cover-v1.stl', stl.asBuffer())
