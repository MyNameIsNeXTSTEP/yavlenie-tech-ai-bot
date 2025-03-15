# FROM node:22-alpine
# EXPOSE 3000
# RUN corepack enable
# RUN corepack prepare yarn@4.5.1 --activate
# WORKDIR /app
# COPY package.json yarn.lock tsconfig.json .yarnrc.yml ./
# COPY . .
# RUN yarn install --immutable
# ENTRYPOINT ["yarn", "run"]

FROM node:22-alpine
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT ["npm", "run"]
