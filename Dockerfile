FROM node:14 as tmp

RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

WORKDIR /opt/tmp
COPY . /opt/tmp

RUN yarn install
RUN yarn build

FROM nginx:latest
COPY --from=tmp /opt/tmp/build /usr/share/nginx/html
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
