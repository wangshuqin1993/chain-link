import { defineStore } from "pinia";
import { RegistryApi } from "@/api/registryApi";
import { EIP1193Provider } from "@web3-onboard/core";
import { LinkTokenApi } from "@/api/linkTokenApi";
import { ChainLinkDBApi, ConsumerTemplate } from "@/db/chainlinkDB";
import { ref, ShallowRef, shallowRef } from "vue";
import { abis, consumer_bytecode } from "@/api/contractConfig";

const initCusumerTemplate = (chainLinkDBApi: ChainLinkDBApi) => {

  const consumerTemplate: ConsumerTemplate = {
    id: 1,
    source: "",
    abi: abis.consumer,
    bytecode: consumer_bytecode
  };

  chainLinkDBApi.addConsumerTemplate(consumerTemplate);
}

export const useChainlinkDB = defineStore("chainlinkDB", () => {
  const chainLinkDBApi = shallowRef(new ChainLinkDBApi());
  const apiStatus = ref();
  const networkId = ref();

  const initContractApi = (network: string) => {
    chainLinkDBApi.value.switchNetwork(network);
    networkId.value = network;
    chainLinkDBApi.value.open().then(() => {
      apiStatus.value = true;
      initCusumerTemplate(chainLinkDBApi.value);
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
    walletAddress.value = address.toLowerCase();
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