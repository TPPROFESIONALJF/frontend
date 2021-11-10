FROM node:16.13-alpine
ARG BACKEND_URL
WORKDIR /app
COPY . /app
RUN npm install --only=prod && \
    npm run build
CMD npm start
