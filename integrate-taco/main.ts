import { decryptRecord } from "./scripts/decrypt-data";
import { encryptRecord } from "./scripts/encrypt-record";
import { uploadData } from "./scripts/upload-data";

export const storeRecord = async (tokenId: number, message: string) => {

    const encryptedMessageHex = await encryptRecord(tokenId, message);
    const receipt = await uploadData(encryptedMessageHex);
    return receipt;
    
};  

export const getRecord = async (receiptId:string) => {

    const response = await fetch(`https://gateway.irys.xyz/${receiptId}`);
    const dataJson = await response.text();
    const record = await decryptRecord(dataJson);
    return record;

}