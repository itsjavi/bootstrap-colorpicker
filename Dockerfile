FROM node:10 as base
WORKDIR /usr/src/app
ENV PATH="/usr/src/app/node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install

FROM base as dev
ENV NODE_ENV=development
CMD ["npm", "run", "start"]
