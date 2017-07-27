FROM node:latest
MAINTAINER Steven Burton <steven.burton@hotmail.co.uk>

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm update

ENV HOME=/home/app

COPY package.json npm-shrinkwrap.json $HOME/uppeat/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/uppeat

RUN npm install
RUN npm cache clean -f

USER root
COPY . $HOME/uppeat/
RUN chown -R app:app $HOME/*

EXPOSE 54321

USER app
CMD ["node", "server.js"]