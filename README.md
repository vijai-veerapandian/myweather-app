## Screenshot

![MyWeather App Screenshot](./assets/screenshot.png)

## MyWeather App

MyWeather App is a containerized application that uses Redis, PostgreSQL, Prometheus, Grafana, and Loki for monitoring and logging, along with a React frontend. This README provides instructions on how to set up and run the application using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

update the `.env` file in the root of your project to store your environment variables:

```plaintext
REACT_APP_GEO_API_URL=https://wft-geo-db.p.rapidapi.com/v1/geo
REACT_APP_RAPIDAPI_KEY=<your key>
REACT_APP_RAPIDAPI_HOST=wft-geo-db.p.rapidapi.com

WEATHER_API_URL=https://api.openweathermap.org/data/2.5
WEATHER_API_KEY=<your key>

REACT_APP_BACKEND_API_URL=http://backend-api:5001
REACT_APP_BACKEND_AI_URL=http://backend-ai:5000
REACT_APP_GEMINI_API_KEY=<your key>
```

## Docker Compose

### Starting the Application

To start the application, run the following command:

```bash
docker-compose up
```

This command will start all the services defined in the `docker-compose.yml` file, including the React frontend, Redis, PostgreSQL, and the backend server.

### Stopping the Application

To stop the application, run the following command:

```bash
docker-compose down
```

This command will stop and remove all the containers defined in the `docker-compose.yml` file.

## Services

### React Frontend

The React frontend is served on port 3000. It uses environment variables to configure the API URLs and headers.

### Redis

Redis is used for caching and is accessible on port 6379.

### PostgreSQL

PostgreSQL is used as the database and is accessible on port 5432. The database credentials are configured using environment variables.

### Backend API Server

The backend API server is served on port 5001. It uses environment variables to configure the Redis and PostgreSQL connections, as well as the OpenWeatherMap API.

### Backend AI Server
The backend AI server is served on port 5000. It uses environment variables to configure the Gemini API key for AI-based weather news summarization.

## Monitoring and Logging

### Prometheus

Prometheus is used for monitoring and scraping metrics from the backend, Redis, and PostgreSQL services. It is accessible on port 9090.

- **Configuration**: The Prometheus configuration file (`prometheus.yml`) is mounted into the container.
- **Metrics Endpoint**: Prometheus scrapes metrics from the `/metrics` endpoint exposed by the backend service.

### Grafana

Grafana is used for visualizing metrics collected by Prometheus. It is accessible on port 3001.

- **Default Credentials**:
  - Username: `admin`
  - Password: `admin` (or the value set in the `GF_SECURITY_ADMIN_PASSWORD` environment variable).
- **Prometheus Data Source**:
  - URL: `http://prometheus:9090`
  - Add this data source in Grafana to visualize metrics.

## Example PromQL Queries

Here are some example PromQL queries you can use in Grafana to visualize metrics:

- **Total HTTP Requests**:
  ```promql
  sum(rate(http_request_count[1m]))
  ```

- **Average Request Duration**:
  ```promql
  rate(http_request_duration_ms_sum[1m]) / rate(http_request_duration_ms_count[1m])
  ```

- **95th Percentile Request Duration**:
  ```promql
  histogram_quantile(0.95, sum(rate(http_request_duration_ms_bucket[1m])) by (le))
  ```

- **Redis Command Duration**:
  ```promql
  histogram_quantile(0.95, sum(rate(redis_command_duration_ms_bucket[1m])) by (le, command))
  ```

- **PostgreSQL Query Duration**:
  ```promql
  histogram_quantile(0.95, sum(rate(postgres_query_duration_ms_bucket[1m])) by (le, query))
  ```
### Loki

Loki is used for centralized log aggregation. It collects logs from all Docker containers and allows querying and visualization in Grafana. It is accessible on port 3100.

* Configuration: The Loki configuration file (loki-config.yaml) is mounted into the container.
* Log Collection: Logs are collected using Promtail, which scrapes logs from Docker containers.

## Promtail Configuration

Promtail is configured to scrape logs from Docker containers using the Docker socket. The configuration file (promtail-config.yaml) includes filters to collect logs only from specific containers.

### Example LogQL Queries

* All Logs from a Specific Container:

```bash
{container="backend-api"}
```
* Error logs:
```bash
{level="error"}
```
* Logs Containing a Specific Keyword:
```bash
{container="backend-api"} |= "weather"
```
## Additional Information

* Ensure that the .env file is properly configured with all required environment variables.
* Use the provided PromQL and LogQL queries in Grafana to monitor metrics and logs.
* For troubleshooting, check the logs of individual containers using:
```bash
docker logs <container_name>
```

```
This will help keep your sensitive information secure.
```
### Summary:
1. **Environment Variables**: Create a .env file to store environment variables.
2. **Docker Compose Commands**: Include commands to start and stop the application using Docker Compose.
3. **Services**: Describe the services (React frontend, Redis, PostgreSQL, backend server) and their configurations.
4. **Logging**: Explain the logging configuration.
5. **Additional Information**: Ensure the .env file is not committed to version control.

These updates to the README.md file will provide clear instructions on how to set up and run the application, as well as how to manage environment variables and logging.

