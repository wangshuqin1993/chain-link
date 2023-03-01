<script lang="ts" setup>
import { onBeforeMount, onMounted, watch } from 'vue';
import Onboard, { type WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { useOnboard } from '@web3-onboard/vue'
import { useWalletAddress } from "@/stores/useWalletAddress";
import walletTitle from '../assets/icons/logo-white.svg';
import { RegistryApi } from "@/api/registryApi";

const walletAddress = useWalletAddress()

const { connectingWallet, connectedWallet, connectWallet, disconnectWallet } = useOnboard()
const emit = defineEmits(["setWalletBtn"]);

const injected = injectedModule()
let walletStates: WalletState[]

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x501',
      token: 'Hamster Moonbeam',
      label: 'Hamster Moonbeam',
      rpcUrl: `https://rpc.moonbeam.hamster-test.newtouch.com`,
    }
  ],
  appMetadata: {
    name: 'Hamster',
    icon: walletTitle, // svg string icon
    description: 'Swap tokens for other tokens',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io/' },
      { name: 'WalletConnect', url: 'https://walletconnect.com/' },
      { name: 'imToken', url: 'https://www.token.im/' },
      { name: 'Math Wallet', url: 'https://www.mathwallet.org/' },
      { name: 'Trust Wallet', url: 'https://trustwallet.com/' },
      { name: 'Huobi Wallet', url: 'https://www.huobi.com/' },
    ]
  },
  connect: {
    showSidebar: false,
  },
  notify: {
    desktop: {
      enabled: true,
      transactionHandler: transaction => {
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'bottomLeft'
    },
    mobile: {
      enabled: true,
      transactionHandler: transaction => {
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'topRight'
    }
  },
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: false,
      minimal: true
    },
    mobile: {
      position: 'topRight',
      enabled: false,
      minimal: true
    }
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'Connect wallet to continue'
        }
      },
    }
  }
})

// 尝试自动连接钱包，如果连不上，返回 null
async function autoConnectSavedWallet(): Promise<WalletState[] | null> {
  const connectedWallets = window.localStorage.getItem('alreadyConnectedWallets')
  // 如果 local storage 里没有保存的钱包，直接返回
  if (connectedWallets == null || connectedWallets === '[]') {
    return null
  }
  // 否则，自动连接第一个钱包
  const previouslyConnectedWallets = JSON.parse(
    connectedWallets
  )
  if (previouslyConnectedWallets) {
    onboard.connectWallet({ autoSelect: previouslyConnectedWallets[0] })
    const walletStates = await onboard.connectWallet({
      autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
    })
    return walletStates
  } else {
    return null
  }
}

onBeforeMount(async () => {
  // 进入页面即要求连接钱包
  const walletStatesOrNull = await autoConnectSavedWallet()
  if (walletStatesOrNull !== null) {
    walletStates = walletStatesOrNull
  }
  if (walletStates !== undefined && walletStates[0]) {
    setWalletAccount(walletStates[0]);
  }
});

const onClickConnect = async () => {
  // 进入页面即要求连接钱包
  const walletStatesOrNull = await autoConnectSavedWallet()
  if (walletStatesOrNull == null) {
    walletStates = await onboard.connectWallet()
  } else {
    walletStates = walletStatesOrNull
  }
  if (walletStates[0]) {
    setWalletAccount(walletStates[0]);
  }
}

const setWalletAccount = async (walletState: { accounts: any; }) => {
  if (walletState) {
    //记录钱包地址
    const { accounts } = walletState;
    window.localStorage.setItem("walletAccount", accounts[0].address);
    walletAddress.setWalletAddress(accounts[0].address);
    emit("setWalletBtn", true);
  } else {
    emit("setWalletBtn", false);
  }
}

const onClickDisconnect = async () => {
  const { provider, label } = connectedWallet.value || {}
  if (provider && label) {
    disconnectWallet({ label })
    emit("setWalletBtn", false);
  }
}


//暴露子组件的方法或者数据
defineExpose({ onClickConnect, onClickDisconnect })
</script>

<style>
onboard-v2 .container {
  z-index: 1;
  position: fixed;
}
</style>
