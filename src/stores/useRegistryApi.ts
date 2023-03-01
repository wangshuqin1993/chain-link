import { defineStore } from "pinia";
import { useOnboard } from '@web3-onboard/vue'
import { RegistryApi } from "@/api/registryApi";


export const useRegistryApi = defineStore("registry", () => {
  let registry: RegistryApi;
  const provider = useOnboard().connectedWallet.value?.provider;
  const network = useOnboard().connectedWallet.value?.chains[0].id;
  if (provider && network){
    registry = new RegistryApi(provider, network);
    return registry;
  }
  // return { registry };
});