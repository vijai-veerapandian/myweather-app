CREATE TABLE weather_data (
  id SERIAL PRIMARY KEY,
  lat VARCHAR(50),
  lon VARCHAR(50),
  data JSONB
);