# Use an official node runtime as a parent image
FROM node:14-alpine as build

# Set the working directory in the container
WORKDIR /app



COPY package.json package-lock.json ./
# Install any needed packages specified in package.json
RUN npm install
# Copy the current directory contents into the container at /app
COPY . /app

# Build the React app
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run serve when the container launches
CMD ["serve", "-s", "build"]

