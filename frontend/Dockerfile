# Build static assets
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app
RUN npm run build

# Serve static build
FROM node:20-slim
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/build /app/build

ENV PORT=3000
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "serve -s build -l tcp://0.0.0.0:${PORT}"]