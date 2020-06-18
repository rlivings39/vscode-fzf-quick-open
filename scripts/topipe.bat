@echo off
REM USAGE: topipe.bat commandString pipename
REM reads input to send to pipename from input pipe
set /p "pipe="
REM commandString{open, add, rg} pwd pipedInput > pipeName
echo %1 $$ %cd% $$ %pipe% > %2
