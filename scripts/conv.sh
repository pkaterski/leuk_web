#!/bin/bash

function conv_data {
  data="$1"
  idx=$2

  cat "./$data" | dos2unix | grep -e '"[^"]*"' -v | grep -e "^,\+$" -v | sed -E 's/Alexan[^,]+/A/g' | grep -v "Mercaptopurine" | tail -n +2 > "./conv/$idx-$data"
}

function main {
  local i=0

  for entry in ""*
  do
    if [[ "$entry" == *.csv ]]
    then
      conv_data "$entry" $i
      i=$(($i + 1))
    fi
  done
}

main

#
