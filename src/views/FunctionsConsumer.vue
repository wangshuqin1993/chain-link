<template>
  <div class="functions-consumer-view">
    <a-button class="create-btn" @click="visible = true">Create FunctionsConsumer</a-button>
    <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="sendRequest(record)">Send Request</a>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" title="Create FunctionsConsumer" :footer="null" @ok="handleOk">
    <p>Some contents...</p>
    <div class="modal-btn">
      <a-button @click='visible = false'>Cancel</a-button>
      <a-button @click="deployBtn" :loading="loading">Deploy</a-button>
    </div>
  </a-modal>

  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import Wallets from "../components/Wallets.vue";
import * as ethers from "ethers";
import { useOnboard } from '@web3-onboard/vue'
const { connectedWallet } = useOnboard();
const dataSource = ref([{ contractAddress: '1234567dfghu', createdTime: '2023-02-28', id: 2343 }]);
const visible = ref(false);
const loading = ref(false);
const showWallets = ref();
const columns = [
  {
    title: 'Contract Address',
    dataIndex: 'contractAddress',
    align: "center",
    key: 'contractAddress',
  },
  {
    title: 'Created',
    dataIndex: 'createdTime',
    align: "center",
    key: 'createdTime',
  },
  {
    title: 'SubscritionID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Action',
    align: "center",
    key: 'action',
  },
]

const sendRequest = (val: any) => {
  if (!val.id) {
    message.info('No id')
  } else {
    message.info('请稍等')
  }
}

const deployBtn = async () => {
  const isWalletAccount = window.localStorage.getItem("alreadyConnectedWallets");
  if (isWalletAccount == null || isWalletAccount === '[]') {
    showWallets.value?.onClickConnect();
  } else {
    loading.value = true;
    const data = connectedWallet.value?.provider
    console.log(data, '909090')
    const provider = new ethers.providers.Web3Provider(data);
    const accounts = await provider.send('eth_requestAccounts', []);
    const factory = new ethers.ContractFactory(
      abi,
      bytecode,
      provider.getSigner()
    );
    try {
      let value = {}
      const contract = await factory.deploy(...Object.values(value));
      await contract.deployed();
    } catch (err: any) {
      message.error(err)
    } finally {
      loading.value = false;
    }
  }
}

</script>

<style scoped lang="scss">
.functions-consumer-view {
  max-width: 1440px;
  margin: 96px 32px 32px;
  text-align: left;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 24px;

  .create-btn {
    margin-bottom: 32px;
  }

  .ant-btn {
    height: 42px;
    border-color: #375bd2;
    background-color: #375bd2;
    color: #ffffff;
    border-radius: 8px;
    font-weight: 700;
  }
}

.modal-btn {
  text-align: center;

  .ant-btn {
    width: 132px;
    height: 42px;
    border-radius: 8px;
    margin: 0 12px;
    font-weight: 700;

    &:last-child {
      color: #375bd2;
      border-color: #375bd2;
    }
  }
}
</style>