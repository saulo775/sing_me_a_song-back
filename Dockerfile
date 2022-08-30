FROM node

WORKDIR usr/src

COPY . .

EXPOSE 5300

RUN npm i && npm run build && npx prisma generate

CMD ["npm", "run", "start"]