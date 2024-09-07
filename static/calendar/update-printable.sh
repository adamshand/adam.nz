#!/bin/bash

# adam: note, this is lightly tested.  be careful overwriting anything known to be valuable / good.

SMALL="512x512"
PRINTABLE="printable"

cd ~/src/adam.nz/static/calendar/

mkdir $SMALL $PRINTABLE

(
  cd $SMALL;
  cp -v ~/Documents/Jobs/Art\ Tees/Shitsville/2021\ Realistic\ Calendar/calendar-{f,s}* .
  mogrify -resize "$SMALL" calendar-{f,s}*;
  open -a ImageOptim calendar-{f,s}*
)

(
  cd $PRINTABLE;
  cp -v ~/Documents/Jobs/Art\ Tees/Shitsville/2021\ Realistic\ Calendar/calendar-{f,s}* .
  # TODO: this is a stupid extra step, but i know it works and can't be bothered figuring out the extent without
  mogrify -resize 3000x3000 calendar-{f,s}*;
  mogrify -background none -resize 58% -gravity north -extent 3000x3000+0-100 calendar-{f,s}*;
  open -a ImageOptim calendar-{f,s}*
)

#pngcrush -rem alla -reduce -brute -l 9 -m 7 calendar-falsehope-dark.png calendar-falsehope-dark-small.png

