const c = require('./../config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')

const api = require('@jscad/scad-api')
const { union, difference, intersection } = api.booleanOps
const { cube, cylinder, sphere, vector_text } = api.primitives3d
const { linear_extrude, rectangular_extrude } = api.extrusions
const { vector_char } = api.text

const line = cube({size: [c.NOZZLE_WIDTH, c.PAD_SIDE*2, c.LAYER_HEIGHT], center: [false, false, false]})
let part = cube({size: [0.1, 0.1, 0.1], center: [true, true, true]})  // just a dummy

// make diagonal carré
for (let x=0;x<=c.PAD_SIDE*3;x+=c.PAD_DENSITY) {
  part = union(part,line.rotateZ(45).translate([x, 0, 0]))
}
part = union(part,part.rotateZ(90).translate([c.PAD_SIDE*1.5, 0, c.LAYER_HEIGHT]))

let selection = cube({size: [c.PAD_SIDE, c.PAD_SIDE, c.PAD_SIDE], center: [true, true, false]})
part = intersection(part,selection.translate([c.PAD_SIDE, c.PAD_SIDE-10, 0]))

let stl = jscad.generateOutput('stla',part)
fs.writeFileSync('stl/nft-tissue-pad1.stl', stl.asBuffer())
