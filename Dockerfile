FROM nginx:1.27.4-alpine3.21
WORKDIR /

COPY ./temp_publish_docker/ /usr/share/nginx/html/

EXPOSE 80
