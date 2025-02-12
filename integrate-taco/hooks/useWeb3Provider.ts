import { ethers } from "ethers";

export const useWeb3Provider = (): ethers.providers.Web3Provider => {
  if (!window.ethereum) {
    throw new Error("window.ethereum is not available. Please install a web3 wallet like MetaMask.");
  }
  return new ethers.providers.Web3Provider(window.ethereum);
};
