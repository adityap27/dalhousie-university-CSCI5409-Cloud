# Taking a parent image of node 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json file and install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm clean-install

# .env file will be created by Beanstalk automatically as per the configured env vars,
# then the npm run build will use that .env for backend URL
# Copy source code and create a build
COPY . /app
RUN npm run build

# Install the serve tool
RUN npm install -g serve

# Exposing the port of React Application
EXPOSE 3000

# Run the React App (Serve the Frontend build)
ENTRYPOINT ["serve", "-s", "build"]