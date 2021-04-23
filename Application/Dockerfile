# Name the node stage "builder"
FROM node:15.2.0-alpine AS builder

# ENV REACT_APP_SERVER_URL http://172.17.0.3:3001/api

# Set working directory
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install
# Copy all files from current directory to working dir in image
COPY . .

# install node modules and build assets
RUN npm run build

# set environment variables
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# nginx state for serving content
FROM nginx

# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

WORKDIR /etc/nginx/conf.d
RUN rm -rf ./* 
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


# ###########
# # BUILDER #
# ###########

# # pull official base image
# FROM node:15.2.0-alpine as builder

# # set working directory
# WORKDIR /app

# # add /usr/src/app/node_modules/.bin to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install and cache app dependencies
# COPY package.json .
# COPY package-lock.json .
# RUN npm ci
# #RUN npm install react-scripts@4.0.0 --silent

# # set environment variables
# ARG REACT_APP_SERVER_URL
# ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL
# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV

# # create build
# COPY . .
# RUN npm run build

# #########
# # FINAL #
# #########

# # base image
# FROM nginx

# # update nginx conf
# #RUN rm -rf /etc/nginx/conf.d
# #COPY conf /etc/nginx

# # copy static files
# COPY --from=builder /app/build /usr/share/nginx/html

# # expose port
# EXPOSE 80
