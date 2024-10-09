# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app
COPY bun.lock* ./
COPY package.json ./
COPY . .
RUN bun i
RUN bun run build
CMD ["bun" , "./build/index.js"]

# Stage 2: Run
# FROM oven/bun:1 AS runner
# WORKDIR /app
# COPY --from=builder /app/build ./build
# COPY --from=builder /app/bun.lock* ./
# COPY --from=builder /app/package.json ./
# RUN bun i
# Can't use --production flag because of bun bug ?
# EXPOSE 3000
# CMD ["bun" , "./build/index.js"]