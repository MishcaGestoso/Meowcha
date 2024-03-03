import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

function Minting() {
  const [mintingAmount, setMintingAmount] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [balance, setBalance] = useState<number>(0);

  const balanceString = balance?.toString();

  const addToken = async () => {
    const { ethereum } = window as any;
    const tokenAddress = "0x81cb69089160cBA0F366d992Ec230efC7AFCc8b4";
    const tokenSymbol = "BUB";
    const tokenDecimals = 18;
    const tokenImage =
      "https://raw.githubusercontent.com/Publeo-RT/Bubbles-ERC20/main/dapp/public/images/Bubbles.png";

    try {
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const getBalance = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const balance = await contract.balanceOf(signer);
      const adjustedBalance = Number(balance) / 1000000000000000000;
      setBalance(adjustedBalance);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintingAmount(0);
    }
  };

  return (
    <div
      className="mt-36 flex justify-center items-center text-white text-center lg:max-w-5xl lg:w-full lg:mb-0 rounded-3xl bg-gradient-to-b from-pink-500 to-pink-700 transition-all border-white border-8"
      style={{
        width: "100%", // Set default width for smaller screens
        height: "40vh",
      }}
    >
      <div>
        <span className="mt-5 flex justify-center items-center font-wonderbar text-white text-2xl">
          Meowcha: &nbsp;{" "}
          <p
            className="font-sans text-white text-2xl"
            style={{ marginTop: "-4px" }}
          >
            {balanceString}
          </p>
          <Image
            src="/images/Meowcha.png"
            alt="Left Image"
            width={50}
            height={50}
            className="ml-1"
          />
          <button
            onClick={() => {
              getBalance();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4 mb-1"
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </span>
        <input
          type="number"
          className="rounded-full p-2 focus:outline-none focus:ring-4 focus:ring-white focus:border-transparent duration:100 transition-all bg-pink-400 caret-white"
          value={mintingAmount}
          onChange={(e) => amountChange(e)}
          placeholder="Enter amount to mint"
          style={{ color: "white" }}
        />
        <div>
          <button
            className="mt-8 font-wonderbar text-pink-500 text-2xl rounded-3xl p-3 bg-white transition duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg"
            onClick={() => {
              mintCoin();
            }}
          >
            MINT
          </button>
        </div>
        <div className="text-2xl">
          {submitted && (
            <div className="mt-4 flex items-center justify-center">
              <Image
                src="/images/donut.png"
                alt="Left Image"
                width={40}
                height={40}
                className="mr-3"
              />
              <p className="font-wonderbar text-white">Minting Successful!</p>
              <Image
                src="/images/donut.png"
                alt="Left Image"
                width={40}
                height={40}
                className="ml-3"
              />
            </div>
          )}
        </div>
        <div className="">
          {submitted && (
            <div className="justify-center flex items-center">
              <a
                href={`https://sepolia.arbiscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-wonderbar text-cyan-300 cursor-pointer hover:scale-105 transition"
              >
                Click to View Transaction
              </a>
            </div>
          )}
        </div>
        <div className="font-wonderbar text-lime-300  cursor-pointer hover:scale-105 transition">
          {submitted && (
            <div className="justify-center flex items-center">
              <button
                onClick={() => {
                  addToken();
                }}
              >
                Add Meowcha to Metamask Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Minting;
