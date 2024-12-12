@echo off

:: Set the WSL command to execute
SET WSL_COMMAND=bash -c "~/eisenhower-matrix/start_services.sh"

:: Run the WSL command
echo Starting services in WSL...
wsl -e %WSL_COMMAND%

echo Services started successfully!

