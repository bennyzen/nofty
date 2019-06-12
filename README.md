# salatower
A simple, 3d printable, vertical salad tower. This is a recirculating NFT
(Nutrient Film Technique) system without any soil or buffering medium. Consumption
of water and production of waste are kept to a minimum.

Things you need:
- filament, 500g
- 1x water pump, >5W
- 1x small tank, >3L
- 1x thin rope, <2m
- 12mm tube, <2m

Things to know:
- the pump should run constantly or at least in short intervals
- lettuce needs a pH of 5.5-6.5 and an EC of 0.8-1.2
- you can grow salad using a photoperiod of only 12 hours, but your growth and
  yield will both be slightly decreased (see https://gpnmag.com/news/use-a-high-yield-photoperiod-to-increase-lettuce-production-by-40-percent/).
  to know the right values for your nutrient solution refer to http://www.homehydrosystems.com/ph_tds_ppm/ph_vegetables_page.html
-

How to print:
All my prints were done on a JGAurora A5 using PLA from REC and a 1.0mm nozzle.
The large nozzle makes prints really fast and sturdy. According to the 1.0mm
nozzle, the WALL_THICKNESS variable was set to 2mm. All pieces are waterproof
and fit into each other. The fit is crucial, so I recommend you follow the
build instructions provided below to the point.


How to build:
- print the bottom first, as it's the hardest piece. print everything from the
  bottom upwards. 
- now print one middle segment first and make sure that it fits into the
  endpiece. if it does not fit, edit the `config.js` file and play with the
  value `RING_INSET` value until you get a snug fit.
- now go on and print the rest of the middle segments, up to 8 pieces
- print the top piece. again, play with the `TOP_DIAMETER` value until it fits.
- starting from the bottom, pull the rope through both holes on equal length.
- now stack up all your middle pieces, always pulling the rope through.
- pull both ends of the rope through the holes in the top piece and make a knot.
