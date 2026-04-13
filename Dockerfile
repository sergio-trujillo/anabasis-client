FROM oven/bun:1 AS build

WORKDIR /build

# Replicate local directory structure so @server alias resolves
COPY praxema-server/ /build/praxema-server/

# Install client deps
WORKDIR /build/praxema-client
COPY praxema-client/package.json praxema-client/bun.lock ./
RUN bun install

COPY praxema-client/ .

# Build (tsc + vite)
RUN bun run build

# Serve with nginx
FROM nginx:alpine

COPY --from=build /build/praxema-client/dist /usr/share/nginx/html
COPY praxema-client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
