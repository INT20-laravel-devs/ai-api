FROM node:22

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate && \
    yarn build && \
    mkdir static

EXPOSE 4555

CMD ["yarn", "start"]