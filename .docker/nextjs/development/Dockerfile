ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

RUN npm i -g @ae-studio/px

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN px ci --legacy-peer-deps

# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
EXPOSE 3000
CMD ["px", "dev"]