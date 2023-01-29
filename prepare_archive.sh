#!/bin/bash
OUTFILE=leukemia_browser.zip
zip -r $OUTFILE dist index.html style.css
echo "-----------------------------"
echo "moving output file to Desktop"
mv $OUTFILE ~/Desktop/
echo "done."
