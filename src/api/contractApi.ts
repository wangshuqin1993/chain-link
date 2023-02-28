import { Contract, ethers } from 'ethers';

interface ContractAPI {
  query: (methodName: string, ...args: any[]) => Promise<any>;
  sendTransaction: (methodName: string, ...args: any[]) => Promise<any>;
}

export function createContractAPI(
  contractAddress: string,
  abi: any[],
  provider: ethers.providers.Web3Provider
): ContractAPI {

  const query = async (methodName: string, ...args: any[]): Promise<any> => {
    const contract = new Contract(contractAddress, abi, provider);
    return await contract[methodName](...args);
  };

  const sendTransaction = async (methodName: string, ...args: any[]): Promise<any> => {
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    const tx = await contract[methodName](...args);
    return tx.wait();
  };

  return {
    query,
    sendTransaction,
  };
}
