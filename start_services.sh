#!/bin/bash

# Set the frontend and backend directories
FRONTEND_DIR="/home/chris/eisenhower-matrix/" # Current directory for frontend files
BACKEND_SCRIPT="/home/chris/eisenhower-matrix/server.py" # Flask backend script
FRONTEND_PORT=8000
BACKEND_PORT=5000

cd /home/chris/eisenhower-matrix/

# Start the Flask backend server
echo "Starting Flask backend server on port $BACKEND_PORT..."
python3 "$BACKEND_SCRIPT" & > /dev/null 2>&1 
BACKEND_PID=$!
echo "Flask server started with PID $BACKEND_PID"

# Start the HTTP server for the frontend
echo "Starting HTTP server for the frontend on port $FRONTEND_PORT..."
cd "$FRONTEND_DIR"
python3 -m http.server $FRONTEND_PORT & > /dev/null 2>&1
FRONTEND_PID=$!
echo "Frontend server started with PID $FRONTEND_PID"

# Wait for user to terminate the script
echo "Services are running. Press Ctrl+C to stop both servers."

# Handle termination gracefully
trap "echo Stopping services...; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM

# Wait indefinitely
while true; do
    sleep 1
done

