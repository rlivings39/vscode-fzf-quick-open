#! /usr/bin/env sh
# USAGE: topipe.bat commandString pipename
# reads input to send to pipename from input pipe
sep='$$'
read arg
# commandString{open, add, rg} pwd pipedInput > pipeName
echo "$1 $sep `pwd` $sep $arg" > $2
