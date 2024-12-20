FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install --verbose
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
