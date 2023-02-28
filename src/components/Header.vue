<template>
  <div class="header">
    <div class="header-left">
      <div class="header-title">Chainlink</div>
      <div class="header-menu">
        <div v-for="item in menuList" :key="item" @click="changePage(item)" :class="selected == item ? 'selected' : ''">{{
          item }}</div>
        <!-- <div @click="changePage(item)" :class="selected == item ? 'selected' : ''">{{ item }}</div> -->
        <!-- <div @click="changePage('functions-request')">FunctionsRequest</div>
        <div @click="changePage('functions-consumer')">FunctionsConsumer</div> -->
      </div>
    </div>
    <div class="header-right">
      <a-select ref="select" v-model:value="worknetValue" @change="handleChange">
        <a-select-option value="2">Ethereum Sepolia</a-select-option>
        <a-select-option value="3">Ethereum Goerli</a-select-option>
      </a-select>
      <a-button v-if="!isConnectedWallet" @click="showWallet">Connect Wallet</a-button>
      <div class="walletAddress" v-else>{{ walletAccount }}</div>
    </div>
  </div>
  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import Wallets from "../components/Wallets.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useWalletAddress } from "@/stores/useWalletAddress";
const worknetValue = ref('2');
const isConnectedWallet = ref(false);
const showWallets = ref();
const walletAccount = ref('');
const selected = ref('Subscription')
// ['Subscription', 'FunctionsRequest', 'FunctionsConsumer']
const menuList = ref(['Subscription', 'FunctionsRequest', 'FunctionsConsumer'])

const router = useRouter();

const walletAddress = useWalletAddress();

const changePage = (val: string) => {
  selected.value = val
  router.push({ name: val })
}

const showWallet = () => {
  showWallets.value?.onClickConnect();
};

// 切换网络
const handleChange = (val: string) => {
  worknetValue.value = val;
  // switchToChain(val)
};

const switchToChain = (chainId: string) => {
  window.ethereum && window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId}` }],
  }).then((res: any) => {
    message.success('success')
  }).catch((err: any) => {
    message.success('faild')
  })
};

watch(
  () => walletAddress.walletAddress,
  (value) => {
    if (value) {
      isConnectedWallet.value = true
      walletAccount.value = walletAddress.walletAddress?.substring(0, 5) + "..." + walletAddress.walletAddress?.substring(walletAddress.walletAddress.length - 4);
    }
  }, { deep: true, immediate: true }
);

</script>

<style scoped lang="scss">
.header {
  padding: 0 32px;
  height: 64px;
  // color: #151210;
  color: #1a2b6b;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;

  .header-left {
    display: flex;

    .header-title {
      height: 64px;
      line-height: 64px;
      font-size: 24px;
      font-weight: 700;
    }

    .header-menu {
      padding-left: 64px;
      height: 64px;
      line-height: 64px;
      display: flex;

      .selected {
        font-weight: 700;
      }

      >div {
        cursor: pointer;

        &:hover {
          color: #375bd2;
        }

        &:nth-child(2) {
          margin: 0 24px;
        }
      }
    }
  }

  .header-right {
    .ant-select {
      margin-right: 24px;
      width: 184px;
    }

    :deep(.ant-select-selector) {
      border-radius: 8px;
      height: 42px;
    }

    :deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
      line-height: 40px;
      color: #1a2b6b;
    }

    .ant-btn {
      width: 132px;
      height: 42px;
      border-radius: 8px;
      margin-top: 11px;
      border-color: #375bd2;
      color: #375bd2;
    }
  }

  .walletAddress {
    display: inline-block;
    margin-top: 11px;
    width: 132px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #375bd2;
    color: #375bd2;
    border-radius: 8px;
  }


}
</style>