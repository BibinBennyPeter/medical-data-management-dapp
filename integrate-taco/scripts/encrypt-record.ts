import { encrypt, conditions, domains, initialize, toHexString } from '@nucypher/taco';
import { useWeb3Provider } from '../hooks/useWeb3Provider';
require('dotenv').config()

// We have to initialize the TACo library first
await initialize();

const MEDICALRECORD_CONTRACT_ADDRESS = process.env.MEDICALRECORD_CONTRACT_ADDRESS;
const web3Provider = useWeb3Provider();
export const encryptRecord = async (tokenId:number,message:string) => {
        
    const ownsNFT = new conditions.predefined.erc721.ERC721Ownership({
    contractAddress: MEDICALRECORD_CONTRACT_ADDRESS?MEDICALRECORD_CONTRACT_ADDRESS:'',
    parameters: [tokenId],
    chain: 11155111,
    });
    const ritualId = 0
    
    // const message = "this will be here forever";
    const messageKit = await encrypt(
    web3Provider,
    domains.TESTNET,
    message,
    ownsNFT,
    ritualId,
    web3Provider.getSigner() 
    );
    const encryptedMessageHex = toHexString(messageKit.toBytes());
    return encryptedMessageHex;
}
