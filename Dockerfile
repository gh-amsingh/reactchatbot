# Step 1: Set the base image
FROM node:16 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use a lightweight server to serve the build files
FROM nginx:alpine

# Step 8: Copy the build files to the nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 (the default HTTP port)
EXPOSE 80

# Step 10: Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
