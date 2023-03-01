import { Contract, ethers } from 'ethers';

interface ContractAPI {
  query: (methodName: string, ...args: any[]) => Promise<any>;
  sendTransaction: (methodName: string, ...args: any[]) => Promise<any>;
  getContract: () => Contract;
  events: (eventName: string, fromBlock?: string, toBlock?: string, ...args: any[]) => Promise<any>
}

export function createContractAPI(
  contractAddress: string,
  abi: any[],
  provider: ethers.providers.Web3Provider
): ContractAPI {

  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, abi, signer);

  const query = async (methodName: string, ...args: any[]): Promise<any> => {
    return await contract[methodName](...args);
  };

  const sendTransaction = async (methodName: string, ...args: any[]): Promise<any> => {
    const tx = await contract[methodName](...args);
    return tx.wait();
  };

  const getContract = () => {
    return contract;
  }

  const events = async (eventName: string, fromBlock?: string, toBlock?: string, ...args: any[]): Promise<any> => {
    const filter = contract.filters[eventName](...args);
    return contract.queryFilter(filter, fromBlock, toBlock);
  };

  return {
    query,
    sendTransaction,
    getContract,
    events
  };
}
