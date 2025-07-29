#!/bin/sh

./node_modules/.bin/prisma migrate deploy --schema=packages/prisma/postgresql/schema.prisma;

bun install

cd packages/embeds/js

bun run build

cd ../../..

npm run dev:viewer
