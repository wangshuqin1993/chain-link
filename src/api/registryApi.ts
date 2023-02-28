import { EIP1193Provider } from '@web3-onboard/core';
import { ethers } from 'ethers';
import { createContractAPI } from './contractApi'
import { networkConfig, abis } from './contractConfig';


export class RegistryApi {
  private contractApi;

  constructor(walletProvider: EIP1193Provider, network: string) {

    const provider = new ethers.providers.Web3Provider(walletProvider)

    const contractABI = abis.functionsBillingRegistryProxy;

    const contractAddress = this.getRegistry(network)

    this.contractApi = createContractAPI(contractAddress, contractABI, provider);
  }

  private getRegistry(network: string): string {
    return networkConfig[network].functionsBillingRegistryProxy;
  }

  async createSubscription(): Promise<any> {
    return await this.contractApi.sendTransaction('createSubscription', {
      gasLimit: 1000000,
    });
  }

  async addConsumer(subscriptionId: bigint, consumer: string): Promise<any> {
    return this.contractApi.sendTransaction('addConsumer', subscriptionId, consumer, {
      gasLimit: 1000000,
    });
  }
}
