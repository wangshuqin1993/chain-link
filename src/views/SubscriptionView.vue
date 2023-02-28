<template>
  <div class="subscription-view">
    <a-button @click="createSubscription">Create Subscription</a-button>
    <div class="subscriptions-list">
      <div class="subscriptions-title">My Subscriptions</div>
    </div>

    <a-tabs v-model:activeKey="activeKey" class="subscription-table">
      <a-tab-pane key="1" tab="Active">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'id'">
              <div class="table-detail">
                <span class="point"></span>
                <a @click="toDetail">{{ text }}</a>
              </div>

            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>

  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Wallets from "../components/Wallets.vue";
import { RegistryApi } from "@/api/registryApi";
import { useOnboard } from '@web3-onboard/vue'
import { any } from "joi";

const router = useRouter();
const showWallets = ref();
const activeKey = ref('1');
const dataSource = reactive([{ id: '1112', createdTime: '2023-02-27', consumers: 0, balance: '0 Link' }]);
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Created',
    dataIndex: 'createdTime',
    align: "center",
    key: 'createdTime',
  },
  {
    title: 'Consumers',
    dataIndex: 'consumers',
    align: "center",
    key: 'consumers',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: "center",
    key: 'balance',
  },
];
let registry: RegistryApi;
const createSubscription = () => {
  const isWalletAccount = window.localStorage.getItem("alreadyConnectedWallets");
  if (isWalletAccount == null || isWalletAccount === '[]') {
    showWallets.value?.onClickConnect();
  } else {
    console.log("wallet", useOnboard().connectedWallet.value?.chains[0].id)
    const provider = useOnboard().connectedWallet.value?.provider;
    const network = useOnboard().connectedWallet.value?.chains[0].id;
    if (provider && network) {
      registry = new RegistryApi(provider, network);
      registry.createSubscription().then(res => {
        console.log(res);
      });
    }


  }
}

const toDetail = () => {
  router.push('/subscription-detail')
}

</script>

<style scoped lang="scss">
.subscription-view {
  text-align: left;
  max-width: 1920px;
  margin: 32px;

  .subscriptions-list {

    .subscriptions-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a2b6b;
      margin-top: 32px;
    }
  }

  .ant-btn {
    width: 184px;
    height: 42px;
    border-color: #375bd2;
    background-color: #375bd2;
    color: #ffffff;
    border-radius: 8px;
    font-weight: 700;
  }
}

.subscription-table {
  .table-detail {
    cursor: pointer;
  }

  .point {
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #ecedef;
    border-radius: 50%;
    position: relative;
    margin-right: 8px;

    &::before {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #2fb96c;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

    }
  }
}
</style>