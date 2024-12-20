# The version of Node that we will use
FROM node:20-alpine



# The working directory of the app in the container
WORKDIR /frontend

COPY package*.json ./

# Install the packages in package.json
RUN npm install

# Copy the project files from the host to the work directory in the container
COPY . .

# Expose the port in the container so that it can be accessed from the outside
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "dev"]