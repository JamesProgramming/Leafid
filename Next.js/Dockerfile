# syntax=docker/dockerfile:1

FROM node:18-bullseye
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000