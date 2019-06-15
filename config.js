/*
Use this configuration file to finetune your salatower. Every printer is
different, so you'll probably need to adjust these values to make things fit
into each other. Values set herein are global and affect all parts of the
system. Tweak them carefully and one by one.

After every change to this config file, you need to re-render your STL files.
You can do this with eg `nodemon bottom/bottom-v3.js`.
*/
const config = {
  WALL_THICKNESS: 2,
  SEGMENT_OUTER_DIAMETER: 80,
  SEGMENT_HEIGHT: 50 + 12,
  POT_INNER_DIAMETER: 34,
  POT_HEIGHT: 35,
  RING_HEIGHT: 12,
  RING_INSET: 4.5,  // play with this value, to make your middle segments fit into each other
  TOP_DIAMETER: 75.5, // play with this value, to make your top segment fit
  END_HEIGHT: 40,
  FLOW_DIAMETER: 12,
  FLOW_HEIGHT: 10,
  ROPE_DIAMETER: 8,
  BASE_SIDE: 200, // 200x200x200 gives 4L of nutrient
  BASE_HEIGHT: 100
}
module.exports = config
