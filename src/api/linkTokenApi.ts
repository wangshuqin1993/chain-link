import { createContractApi } from './contractApi'
import { networkConfig, abis } from './contractConfig';
import { BigNumber, ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';

export class LinkTokenApi {
  private contractApi;
  public contract;

  constructor(walletProvider: EIP1193Provider, network: string) {

    const provider = new ethers.providers.Web3Provider(walletProvider)

    const contractABI = abis.linkToken;

    const contractAddress = this.getLinkToken(network)

    this.contractApi = createContractApi(contractAddress, contractABI, provider);

    this.contract = this.contractApi.getContract();
  }

  private getLinkToken(network: string): string {
    return networkConfig[network].linkToken;
  }

  async transferAndCall(to: string, value: BigNumber, data: string): Promise<any> {
    return this.contractApi.sendTransaction('transferAndCall', to, value, data, {
      gasLimit: 1000000,
    });
  }

  async balanceOf(owner: string): Promise<any> {
    return this.contractApi.query('balanceOf', owner);
  }
}
