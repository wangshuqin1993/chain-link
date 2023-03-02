<template>
  <div class="header">
    <div class="header-left">
      <div class="header-title">Chainlink</div>
      <a-menu v-model:selectedKeys="current" mode="horizontal">
        <a-menu-item v-for="item in menuList" :key="item.name">
          <a href="javascript:;" @click="changePage(item)"> {{ item.name }}</a>
        </a-menu-item>
      </a-menu>
      <div class="header-menu">
        <!-- <div v-for="item in menuList" :key="item" @click="changePage(item)" :class="selected == item ? 'selected' : ''">
          {{
            item }}</div> -->
        <!-- <div @click="changePage(item)" :class="selected == item ? 'selected' : ''">{{ item }}</div> -->
        <!-- <div @click="changePage('functions-request')">FunctionsRequest</div>
        <div @click="changePage('functions-consumer')">FunctionsConsumer</div> -->
      </div>
    </div>
    <div class="header-right">
      <a-select ref="select" v-model:value="worknetValue" @change="handleChange">
        <a-select-option value="aa36a7">Ethereum Sepolia</a-select-option>
        <a-select-option value="13881">Polygon Mumbai</a-select-option>
      </a-select>
      <a-button v-if="!isConnectedWallet" @click="showWallet">Connect Wallet</a-button>
      <div class="walletAddress" v-else>{{ walletAccount }}</div>
    </div>
  </div>
  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import Wallets from "../components/Wallets.vue";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useWalletAddress } from "@/stores/useWalletAddress";
import { useOnboard } from '@web3-onboard/vue';
const { setChain } = useOnboard();

const worknetValue = ref('aa36a7');
const isConnectedWallet = ref(false);
const showWallets = ref();
const walletAccount = ref('');
// const selected = ref('Subscription')
const current = ref<string[]>(['Subscription']);
const menuList = ref([{ name: 'Subscription', path: '/subscription' }, { name: 'FunctionsConsumer', path: '/functions-consumer' }, { name: 'FunctionsRequest', path: '/functions-request' }])
const router = useRouter();

const walletAddress = useWalletAddress();

const changePage = (val: any) => {
  localStorage.setItem('currentPageName', val.name)
  router.push({ name: val.name })
}

const showWallet = () => {
  showWallets.value?.onClickConnect();
};

// 切换网络
const handleChange = (val: string) => {
  worknetValue.value = val;
  switchToChain(val)
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

  // setChain({ wallet: 'MetaMask', chainId: `0x${chainId}` })
};

onMounted(() => {
  current.value = [localStorage.getItem('currentPageName')] || ['Subscription'];
})

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
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 32px;
  height: 64px;
  color: #1a2b6b;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  z-index: 1;

  .header-left {
    display: flex;

    .header-title {
      height: 64px;
      line-height: 64px;
      font-size: 24px;
      font-weight: 700;
      margin-right: 32px;
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

:deep(.ant-menu-horizontal) {
  line-height: 66px;
}
</style>