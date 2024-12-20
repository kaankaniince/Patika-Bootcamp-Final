FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm installRUN npm cache clean --force && npm install --verbose
COPY . .
EXPOSE 3001
CMD ["npm", "start"] 