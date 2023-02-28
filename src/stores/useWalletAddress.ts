import { ref } from "vue";
import { defineStore } from "pinia";

export const useWalletAddress = defineStore("walletAddress", () => {
  const walletAddress = ref('');
  walletAddress.value = localStorage.getItem('') || ''
  const setWalletAddress = (val: string) => {
    walletAddress.value = val
  };

  return { walletAddress, setWalletAddress };
});