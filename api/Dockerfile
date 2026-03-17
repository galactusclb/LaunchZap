FROM node:lts-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 4000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["pnpm", "run", "dev"]