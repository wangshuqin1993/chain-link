import { defineStore } from "pinia";
import { RegistryApi } from "@/api/registryApi";
import { EIP1193Provider } from "@web3-onboard/core";
import { LinkTokenApi } from "@/api/linkTokenApi";
import { ChainLinkDBApi } from "@/db/chainlinkDB";
import { ref, ShallowRef, shallowRef } from "vue";


export const useChainlinkDB = defineStore("chainlinkDB", () => {
  const chainLinkDBApi = shallowRef(new ChainLinkDBApi());
  const apiStatus = ref();
  const networkId = ref();

  const initContractApi = (network: string) => {
    chainLinkDBApi.value.switchNetwork(network);
    networkId.value = network;
    chainLinkDBApi.value.open().then(() => {
      apiStatus.value = true;
    })
  };
  const switchNetwork = (network: string) => {
    chainLinkDBApi.value.switchNetwork(network);
    networkId.value = network;
  }

  return { chainLinkDBApi, apiStatus, networkId, initContractApi, switchNetwork };
});

export const useContractApi = defineStore("contractApi", () => {
  const registryApi: ShallowRef<RegistryApi | undefined> = shallowRef();
  const linkTokenApi: ShallowRef<LinkTokenApi | undefined> = shallowRef();
  const provider = shallowRef();
  const networkId = ref();
  const walletAddress = ref();
  const apiStatus = ref();

  const initContractApi = (web3Provider: EIP1193Provider, network: string, address: string) => {
    provider.value = web3Provider;
    networkId.value = network;
    walletAddress.value = address;
    registryApi.value = new RegistryApi(web3Provider, network)
    linkTokenApi.value = new LinkTokenApi(web3Provider, network);
    apiStatus.value = true;
  };

  return {
    registryApi,
    linkTokenApi,
    provider,
    networkId,
    walletAddress,
    apiStatus,
    initContractApi
  };
});