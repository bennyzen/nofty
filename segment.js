const c = require('./config.js')

const fs = require('fs')
const jscad = require('@jscad/openjscad')
const cag = require('@jscad/csg').CAG
const csg = require('@jscad/csg').CSG

let tube = csg.cylinder({
  r: c.SEGMENT_OUTER_DIAMETER / 2,
  h: c.SEGMENT_HEIGHT
})

let pot = csg.cylinder({
  r: (c.POT_INNER_DIAMETER/2) + c.WALL_THICKNESS,
  h: c.POT_HEIGHT
})
  .rotateY(-45)
  .translate([-28, 0, 10])

tube = csg.union(tube,pot)

let stla = jscad.generateOutput('stla',tube)
fs.writeFileSync('test.stl', stla.asBuffer())
