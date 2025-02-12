import { Uploader } from "@irys/upload";
import { Arbitrum } from "@irys/upload-ethereum";
 
const getIrysUploader = async () => {
  // RPC URLs change often. Use a current one from https://chainlist.org/
  const rpcURL = "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public"; 
  const irysUploader = await Uploader(Arbitrum)
    .withWallet(process.env.PRIVATE_KEY)
    .withRpc(rpcURL)
    .devnet();
 
  return irysUploader;
};

export const uploadData = async (dataToUpload:string) => {
	const irysUploader = await getIrysUploader();
	// const dataToUpload = "hirys world.";
	try {
		const receipt = await irysUploader.upload(dataToUpload);
		console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
		return receipt;
	} catch (e) {
		console.log("Error when uploading ", e);
	}
};