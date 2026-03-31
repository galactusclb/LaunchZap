FROM node:lts-alpine

RUN npm install -g pnpm

ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install

COPY . .

RUN pnpm run generate

RUN pnpm run build

EXPOSE 4000

# RUN chmod +x ./entrypoint.sh

# ENTRYPOINT ["./entrypoint.sh"]

CMD ["pnpm", "run", "dev"]