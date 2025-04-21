# ./frontend/Dockerfile

# ---- Stage 1: Build the React App ----
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package manifests
    COPY package.json package-lock.json* ./
    
    # Install dependencies
    # Use 'ci' for faster, more reliable builds if you have a lock file
    RUN npm ci
    
    # Copy the rest of the application source code
    COPY . .
    
    # Get build-time arguments defined in docker-compose.yml
    # Note: These are embedded during the build, not available at runtime in the final Nginx image
    ARG REACT_APP_WEATHER_API_URL
    ARG REACT_APP_WEATHER_API_KEY
    ARG REACT_APP_GEO_API_URL 
    ARG REACT_APP_RAPIDAPI_KEY
    ARG REACT_APP_RAPIDAPI_HOST
    ARG REACT_APP_BACKEND_AI_URL 
    
    ENV REACT_APP_WEATHER_API_URL=${REACT_APP_WEATHER_API_URL}
    ENV REACT_APP_WEATHER_API_KEY=${REACT_APP_WEATHER_API_KEY}
    ENV REACT_APP_GEO_API_URL=${REACT_APP_GEO_API_URL}
    ENV REACT_APP_RAPIDAPI_KEY=${REACT_APP_RAPIDAPI_KEY}
    ENV REACT_APP_RAPIDAPI_HOST=${REACT_APP_RAPIDAPI_HOST} 
    ENV REACT_APP_BACKEND_AI_URL=${REACT_APP_BACKEND_AI_URL}
    # Build the static files (output usually goes to a 'build' or 'dist' folder)
    # Ensure your package.json's "build" script exists and works
    RUN npm run build
    
    # ---- Stage 2: Serve with Nginx ----
    FROM nginx:stable-alpine
    
    # Remove default Nginx configuration
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy our custom Nginx configuration
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy the static build output from the 'builder' stage to Nginx's web root
    # Adjust '/app/build' if your build script outputs to a different directory (e.g., 'dist')
    COPY --from=builder /app/build /usr/share/nginx/html
    
    # Expose port 80 (the port Nginx listens on)
    EXPOSE 80
    
    # Start Nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]    