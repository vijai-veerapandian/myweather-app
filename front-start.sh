#!/bin/bash
# filepath: /home/vboxuser/apps-dev/myweather-app3/myweather-app/set-env.sh

# Fetch the host IP
HOST_IP=$(hostname -I | awk '{print $1}')

# Export the environment variable
export REACT_APP_BACKEND_AI_URL="http://$HOST_IP:5000"

# Start the application
npm start
