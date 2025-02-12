import { conditions, decrypt, domains, ThresholdMessageKit } from '@nucypher/taco';
import { EIP4361AuthProvider, USER_ADDRESS_PARAM_DEFAULT } from '@nucypher/taco-auth';
import { useWeb3Provider } from '../hooks/useWeb3Provider';

// const response = await fetch(`https://gateway.irys.xyz/${receipt.id}`);
// const dataJson = await response.text();
const web3Provider = useWeb3Provider();
export const decryptRecord = async (dataJson:string) => {
  const encryptedMessage = ThresholdMessageKit.fromBytes(
    Buffer.from(JSON.parse(dataJson), 'hex'),
  );

  // auth provider when condition contains ":userAddress" context variable
  // the decryptor user must provide a signature to prove ownership of the wallet address
  const authProvider = new EIP4361AuthProvider(
    web3Provider,
    web3Provider.getSigner(),
  );
  const conditionContext =
    conditions.context.ConditionContext.fromMessageKit(encryptedMessage);
  conditionContext.addAuthProvider(USER_ADDRESS_PARAM_DEFAULT, authProvider);

  const decryptedMessage = await decrypt(
    web3Provider,
    domains.TESTNET,
    encryptedMessage,
    conditionContext,
  );

  console.log(decryptedMessage);
}