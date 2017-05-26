# minimal nodeJs 4.47 stable image, instead
# of a larger image like node:argon
FROM mhart/alpine-node:4

# Create app directory
RUN mkdir -p /DemoDockerApp
WORKDIR /DemoDockerApp

# Install app dependencies
COPY package.json /DemoDockerApp
RUN npm install

# Bundle app source
COPY . /DemoDockerApp

EXPOSE 80
CMD [ "npm", "start" ]
