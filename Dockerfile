FROM node:boron



COPY package.json  $HOME/back-sami/

WORKDIR $HOME/back-sami

RUN npm install --silent --progress=false

RUN npm install -g @babel/cli

COPY . $HOME/back-sami/

CMD ["npm", "start"]