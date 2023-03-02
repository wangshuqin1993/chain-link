<template>
  <Header></Header>
  <router-view />
</template>
<script lang="ts" setup>
import Header from './components/Header.vue';
import { init } from '@web3-onboard/vue';
import injectedModule from '@web3-onboard/injected-wallets';
import { ConfigProvider } from 'ant-design-vue';


ConfigProvider.config({
  theme: {
    primaryColor: '#375bd2',
  },
});

const injected = injectedModule()

init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://rpc.moonbeam.hamster-test.newtouch.com`,
    }
  ]
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1440px;
  margin: 0 auto;
  font-size: 14px;
  padding-bottom: 2px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    // color: #2c3e50;
    color: #1a2b6b;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
