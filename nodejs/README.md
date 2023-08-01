# NODE JS Setup

### Install Packages

```shell
sudo apt update
sudo apt-get install -y nodejs
nodejs --version
sudo apt install npm
npm --version
sudo npm install -g yarn
sudo yarn global add ts-node
sudo npm install -g typescript
```

### Update Node Version

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v18.17.0
node --version
```

### Create a Project

https://github.com/coderaidershaun/mempool-watcher/blob/main/main.js

```shell
mkdir code && cd code
mkdir listener && cd listener
yarn init
touch main.js
yarn add ethers
```
