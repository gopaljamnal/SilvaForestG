


# Use an official node runtime as a parent image
FROM node:16.20.2

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Build the React app
RUN npm run build

# Serve the React app using a simple static server
RUN npm install -g serve

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run serve when the container launches
CMD ["serve", "-s", "build"]

