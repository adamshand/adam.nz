# Build with: docker build -t IMAGE_NAME .
#   Run with: docker run -p 3000:3000 --rm -d -e PUBLIC_POCKETBASE_URL=https://pb.haume.nz --name IMAGE_NAME IMAGE_NAME

FROM node:current-alpine AS builder
WORKDIR /staging
COPY . /staging/
RUN corepack enable && \
  pnpm install --frozen-lockfile && \
  pnpm build && \
  pnpm prune --prod

FROM node:current-alpine
WORKDIR /app
COPY --from=builder /staging/package.json /staging/pnpm-lock.yaml  /app/
COPY --from=builder /staging/node_modules /app/node_modules
COPY --from=builder /staging/build /app/build

# ENV PUBLIC_POCKETBASE_URL=https://pb.haume.nz
EXPOSE 3000
CMD ["node", "/app/build/index.js"]

# if all dependencies in package.json are dev, you can omit node_modules, but it's tiny so don't bother.


# needed if you want to use a .env file (instead of setting env variables in CapRover etc.)
# CMD ["node", "-r", "dotenv/config", "/app/build/index.js"]


# ARG TZ=Pacific/Auckland
# RUN apk --no-cache add curl tzdata && \
#     cp /usr/share/zoneinfo/$TZ /etc/localtime && \
#     echo $TZ > /etc/timezone

# ENV PORT 80  # Node port inside container (3000 default)
