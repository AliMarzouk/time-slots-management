FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .

FROM base AS dev
WORKDIR /app
EXPOSE  4200
CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM base AS build
RUN ng build --configuration production

FROM nginx:stable-alpine as prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/time-slots-ui/browser /usr/share/nginx/html
COPY --from=build /app/dist/time-slots-ui/browser /usr/ali-test

CMD ["nginx", "-g", "daemon off;"]
