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

# Do NOT set a fixed PORT; Railway injects PORT dynamically
# EXPOSE is optional and not required on Railway
ENTRYPOINT ["sh", "-c", "serve -s build -l ${PORT:-3000}"]