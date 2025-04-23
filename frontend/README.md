# /home/vboxuser/apps-dev/myweather-app3/testv4/myweather-app/README.md

![MyWeather App Screenshot](./assets/ottawacityweather.png)

## MyWeather App

A simple weather application using a React frontend and an AI-powered backend. Logs are collected using Loki and visualized with Grafana.

## Prerequisites

*   Docker
*   Docker Compose

## Getting Started

1.  **Set up Environment Variables:**
    Create a file named `.env` in this directory (`/home/vboxuser/apps-dev/myweather-app3/testv4/myweather-app/`) and add your API keys:

    ```plaintext
    # .env file contents

    # --- Required API Keys ---
    REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
    REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key_here
    GEMINI_API_KEY=your_gemini_api_key_here

    # --- Optional/Default URLs (usually fine as is) ---
    REACT_APP_GEO_API_URL=https://wft-geo-db.p.rapidapi.com/v1/geo
    REACT_APP_RAPIDAPI_HOST=wft-geo-db.p.rapidapi.com
    REACT_APP_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
    REACT_APP_BACKEND_AI_URL=http://localhost:5000
    ```
    **Important:** Add `.env` to your `.gitignore` file to avoid committing secrets!

2.  **Run the Application:**
    Open your terminal in this project directory and run:

    ```bash
    # Build the images (needed the first time or after code changes)
    sudo docker-compose build

    # Start all services
    sudo docker-compose up -d
    ```

## Accessing the Services

*   **Weather App Frontend:** http://localhost:3000
*   **Grafana (for Logs):** http://localhost:3001
    *   Login: `admin` / `admin`

## Viewing Logs in Grafana

1.  Open Grafana: http://localhost:3001
2.  Log in (`admin`/`admin`).
3.  **Add Loki Data Source (if not already done):**
    *   Go to Connections (or Configuration) -> Data Sources -> Add data source.
    *   Select `Loki`.
    *   Set the **URL** to: `http://loki:3100`
    *   Click `Save & Test`.
4.  **Explore Logs:**
    *   Go to the `Explore` section (compass icon).
    *   Select the `Loki` data source from the dropdown.
    *   Use LogQL queries to find logs, for example:
        *   `{service="frontend"}` - Show logs from the React frontend.
        *   `{service="weatherai"}` - Show logs from the backend service.

## Stopping the Application

To stop and remove the containers:

```bash
sudo docker-compose down
```
(If the above command times out, you might need to increase the timeout: COMPOSE_HTTP_TIMEOUT=120 sudo docker-compose down)

Services Overview
frontend: The React user interface.
weatherai: The backend API service.
loki: Stores logs from other services.
grafana: Visualizes logs stored in Loki.