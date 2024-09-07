#!/bin/bash

base="https://github.com/hfg-gmuend/openmoji/raw/master/color/svg"
project="/Users/adam/src/adam.nz"

cd ${project}/static/emojivore/svg

for emoji in $(awk -F\' '/code:/ {print $2}' ${project}/src/routes/emojivore/constants.js); do
  file="${emoji}.svg"
  if [ -r $file ]; then
    echo "${emoji}: has"
  else
    curl -sL -o ${file} ${base}/${file} && echo "${emoji}: got"
  fi
done
