# Installing Ethereum Blockchain from Scratch

### Prepare Ubuntu

```shell
sudo apt-get update
sudo apt update
sudo apt-get -y upgrade
sudo apt-get -y install build-essential
sudo apt-get -y install software-properties-common
```

### Installing useful command line packages

```shell
sudo apt-get -y install net-tools
sudo apt-get -y install iftop
```

### Installing software

```shell
sudo apt-get -y install snapd
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get -y install ethereum
sudo apt-get install --only-upgrade geth
sudo snap install go --classic
```

### Create Prysm BEACON Consensus client

In your /home/ubuntu/ folder (~), create a folder structure as follows:

```shell /home/ubuntu/
mkdir ethereum
cd ethereum
mkdir consensus
mkdir execution
cd consensus
```

Istall prysm within the consensus folder created above:

```shell /home/ubuntu/ethereum/consensus/
mkdir prysm && cd prysm
curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh && chmod +x prysm.sh
```

Generate a JWT auth token. This is required for communication between the execution and consensus client.

```shell
./prysm.sh beacon-chain generate-auth-secret
```

Prysm will output your jwt.hex file path, such as:

/home/ubuntu/ethereum/consensus/prysm/jwt.hex

### Test Your Execution (GETH) Client

Navigate to your ethereum folder

```shell
cd /home/ubuntu/ethereum/execution/
```

Note: Make sure the correct jwt.hex filepath is used below:

```shell /home/ubuntu/ethereum/execution/
geth --http --http.api personal,eth,net,web3,debug,txpool,admin --authrpc.jwtsecret /home/ubuntu/ethereum/consensus/prysm/jwt.hex --ws --ws.port 8546 --ws.api eth,net,web3,txpool,debug --metrics --maxpeers 500
```

### Start Prysm Beacon Node

Navigate to your prysm folder

```shell
cd /home/ubuntu/ethereum/consensus/prysm/
```

Replace the --suggested-fee-recipient with your own address below:

```shell /home/ubuntu/ethereum/consensus/prysm/
./prysm.sh beacon-chain --execution-endpoint=http://localhost:8551 --jwt-secret=/home/ubuntu/ethereum/consensus/prysm/jwt.hex --suggested-fee-recipient=0x0d09aEC2D10F396fB59482644708CBd353798b87
```

### Test Geth

Navigate to your Geth execution folder

```shell
cd /home/ubuntu/ethereum/execution/
```

geth --http --http.addr "0.0.0.0" --http.port "8545" --http.corsdomain "\*" --http.api personal,eth,net,web3,debug,txpool,admin --authrpc.jwtsecret /home/ubuntu/ethereum/consensus/prysm/jwt.hex --ws --ws.port 8546 --ws.api eth,net,web3,txpool,debug --metrics --maxpeers 500

Great. We are now ready to set these up to run as services.

### GETH Service Setup

First, stop any instances of prysm or geth from running.

Note: Run Prysm Beacon node below in conjuction with this step but do geth first.

```shell
sudo nano /lib/systemd/system/geth.service
```

<i>Then paste in the information from the geth.service file</i>

Save. Then run the following:

```shell
sudo systemctl daemon-reload
sudo systemctl enable geth
sudo systemctl start geth
sudo systemctl status geth
sudo journalctl -f -u geth
```

You should see an active status and the node starting to connect to peers.

### Start Prysm Beacon Node

Make sure geth is running before doing this next step.

Takes a few days to sync. To speed this up to seconds, the below is used (remove these from the .service file if needed):

--checkpoint-sync-url=https://sync-mainnet.beaconcha.in --genesis-beacon-api-url=https://sync-mainnet.beaconcha.in

These docs just assume you want to connect and trust the above.

If they dont work, remove them and wait a few days to sync your beacon node.

Right now, just copy the prysm.service as is into the below directory.

```shell
sudo nano /lib/systemd/system/prysm.service
```

<i>Then paste in the information from the prysm.service file</i>

### Setup NGINX

Follow NGINX Instructions to access queries remotely.

### Monitor

It usually will take about 30-60 minutes for your node to start showing get as syncing (geth attach, eth.syncing).

You can enter into the mode to check this by following:

```shell
geth attach
```

The one of the commands:

```javascript
eth.syncing;
eth.blockNumber;
net.peerCount;
txpool.status;
admin.nodeInfo;
admin.peers;
```

```shell
exit
```

### Check blocknumber using Curl

```shell
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -H "Content-Type: application/json" http://localhost:8545
```
