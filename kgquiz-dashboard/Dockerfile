FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN mkdir -p node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]