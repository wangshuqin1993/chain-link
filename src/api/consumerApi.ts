import { createContractAPI } from './contractApi'
import { abis } from './contractConfig';
import { ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';

export class ConsumerApi {
  private contractApi;
  public contract;

  constructor(walletProvider: EIP1193Provider, contractAddress: string) {

    const provider = new ethers.providers.Web3Provider(walletProvider)

    const contractABI = abis.consumer;

    this.contractApi = createContractAPI(contractAddress, contractABI, provider);

    this.contract = this.contractApi.getContract();
  }


  async executeRequest(
    source: string,
    secrets: string,
    secretsLocation: number,
    args: string[],
    subscriptionId: number,
    gasLimit: number): Promise<any> {
    return this.contractApi.sendTransaction(
      'executeRequest',
      source, secrets,
      secretsLocation,
      args,
      subscriptionId,
      gasLimit,
      {
        gasLimit: 1000000,
      });
  }

  async getDONPublicKey(): Promise<any> {
    return this.contractApi.query('getDONPublicKey');
  }
}
