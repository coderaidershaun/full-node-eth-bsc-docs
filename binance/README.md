# Installing for Binance Smart Chain

https://docs.bnbchain.org/docs/validator/fullnode/

### Preparations

```shell
sudo apt update
sudo apt install unzip
sudo apt-get -y install net-tools
sudo apt-get -y install iftop
sudo apt-get install liblz4-tool
sudo apt-get install -y aria2
sudo apt update
mkdir bsc
cd bsc
```

### Download Geth

```shell
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep geth_linux |cut -d\" -f4)
mv geth_linux geth

chmod -v u+x geth
```

### Download Genesis and Config Files

```shell
wget   $(curl -s https://api.github.com/repos/bnb-chain/bsc/releases/latest |grep browser_ |grep mainnet |cut -d\" -f4)

unzip mainnet.zip
```

### Update Configuration File

Perform the following updates in the conf.toml file:

(Change ports if running on the same instance as another blockchain)

```plaintext
[Node.P2P]...
MaxPeers = 500

[Node]...
HTTPPort = 8545
WSPort = 8546
HTTPModules = ["eth", "net", "web3", "debug", "txpool", "parlia", "admin", "personal"]
WSModules = ["net", "web3", "debug", "eth"]
```

// before
// ["eth", "net", "web3", "txpool", "parlia"]
// ["net", "web3", "eth"]

### Download Chaindata Snapshot

Go to the following url: https://github.com/bnb-chain/bsc-snapshots

Right click on the Endpoint and get the Url address. The endpoint may look something like this: geth-20230416.tar.lz4
https://pub-c0627345c16f47ab858c9469133073a8.r2.dev/geth-20230719.tar.lz4

Then past the address below on the wget.

<i>This may take up to half a day</i>

```shell ~/bsc
aria2c -o geth.tar.lz4 -s14 -x14 -k100M https://pub-c0627345c16f47ab858c9469133073a8.r2.dev/geth-20230719.tar.lz4 -o geth.tar.lz4
```

Remember you can also kill the process by using kill 'Insert PID'

<i>Decompression takes a couple of hours so we run this in the background</i>

```shell
nohup tar -I lz4 -xvf geth.tar.lz4 &
```

You can check the size downloaded by using:

```shell ~/bsc
lsof nohup.out
tail -40 nohup.out
```

Once the above process has finished decompressing (takes around 2 hours) remove mainnet.zip file which is no longer needed:

```shell ~/bsc
sudo rm mainnet.zip
```

### Move TrieCache and Chaindata

Create a folder to save data in:

```shell ~/bsc
mkdir node
```

Create a folder called chain data, then move the extracted snapshot to it:

```shell ~/bsc
mkdir data/chaindata
mv server/data-seed/geth/chaindata data/chaindata
```

### Execute Running BSC Node

```shell ~/bsc
./geth --config ./config.toml --datadir ./data/chaindata/chaindata  --cache 18000 --rpc.allow-unprotected-txs --txlookuplimit 0
```
