#!/bin/bash
zip -r out.zip dist index.html style.css
echo "-----------------------------"
echo "moving output file to Desktop"
mv out.zip ~/Desktop/
echo "done."
