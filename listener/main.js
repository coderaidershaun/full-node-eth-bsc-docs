const ethers = require("ethers");

// !!! Make sure to use "ethers": "5.7.2" verison

const httpProviderUrl = "http://localhost:8545"
const provider = new ethers.providers.JsonRpcProvider(httpProviderUrl)

const wssUrl = "http://localhost:8546"
const providerWss = new ethers.providers.WebSocketProvider(wssUrl)

const addressUniswapV3 = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const abiERC20 = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]

const main = async () => {
  providerWss.on("pending", async (txHash) => {

    try {
      const tx = await provider.getTransaction(txHash);
      
      const gasPrice = ethers.utils.formatUnits(tx.gasPrice, "ether");
      const gasLimit = ethers.utils.formatUnits(tx.gasLimit, "ether");

      if (tx && tx.to === addressUniswapV3) {

        const byteSlice = ethers.utils.hexDataSlice(tx.data, 0, 4);
        const dataSlice = ethers.utils.hexDataSlice(tx.data, 4);
        
        if (byteSlice == "0x414bf389" || byteSlice == "0xdb3e2198") {

          const decoded = ethers.utils.defaultAbiCoder.decode(
            ["address", "address", "uint24", "address", "uint256", "uint256", "uint256", "uint160"],
            dataSlice
          );

          const tokenIn = decoded[0];
          const tokenOut = decoded[1];
          const fee = decoded[2];
          const recipient = decoded[3];
          const deadline = decoded[4];
          
          const amount1 = decoded[5];
          const amount2 = decoded[6];
          const sqrtPrice = decoded[7];

          const contractTokenIn = new ethers.Contract(tokenIn, abiERC20, provider);
          const contractTokenOut = new ethers.Contract(tokenOut, abiERC20, provider);
          
          const symbolIn = await contractTokenIn.symbol();
          const symbolOut = await contractTokenOut.symbol();
          
          const decimalsIn = await contractTokenIn.decimals();
          const decimalsOut = await contractTokenOut.decimals();
          
          const useAmount = amount1;
          const useSymbol = byteSlice == "0x414bf389" ? symbolIn : symbolOut;
          const useDecimals = byteSlice == "0x414bf389" ? decimalsIn : decimalsOut;
          const direction = byteSlice == "0x414bf389" ? "selling" : "buying";

          const readAmount = ethers.utils.formatUnits(useAmount, useDecimals);

          // Console log output
          const output = `User is ${direction} ${useSymbol} for amount of ${readAmount}`;
          console.log(output);
          console.log("Gas price is: ", gasPrice);
          console.log("Gas limit is: ", gasLimit);

        }

      }

    } catch (err) {

    }

  })
}

main();