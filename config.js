/*
Use this configuration file to finetune your salatower. Every printer is
different, so you'll probably need to adjust these values to make things fit
into each other. Values set herein are global and affect all parts of the
system. Tweak them carefully and one by one.

After every change to this config file, you need to re-render your STL files.
You can do this with eg `nodemon bottom/bottom-v3.js`.
*/
const config = {
  // tower
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
  // base
  BASE_SIDE: 200,
  BASE_HEIGHT: 100,
  // nft hooks
  HOOK_THICKNESS: 3,
  HOOK_HEIGHT: 6,
  HOOK_MIDDLE: 82,
  // nft tissue pad
  NOZZLE_WIDTH: 1.01,
  LAYER_HEIGHT: 0.9,
  PAD_SIDE: 100,
  PAD_DENSITY: 6,
  // nft cover clips
  NFT_COVER_HEIGHT: 3.0,
  NFT_STICK_DIAMETER: 5.7,
}
module.exports = config
