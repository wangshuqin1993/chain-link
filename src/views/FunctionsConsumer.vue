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
import { useChainlinkDB, useContractApi } from "@/stores/useStore";
import { networkConfig } from "@/api/contractConfig";
import { ConsumerContract } from "@/db/chainlinkDB";
import dayjs from "dayjs";
const { connectedWallet } = useOnboard();

const chainlinkDB = useChainlinkDB()
const contractApi = useContractApi()


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
  console.log("start")
  if (contractApi.apiStatus && chainlinkDB.apiStatus) {
    let res = await chainlinkDB.chainLinkDBApi.getAllConsumerTemplate();
    console.log("provider", contractApi.provider)
    const rpcProvider = new ethers.providers.Web3Provider(contractApi.provider);
    const factory = new ethers.ContractFactory(
      res[0].abi,
      res[0].bytecode,
      rpcProvider.getSigner()
    );
    try {
      let value = {
        oracleAddress: networkConfig[contractApi.networkId].functionsOracleProxy
      }
      const contract = await factory.deploy(...Object.values(value));
      await contract.deployed();
      console.log("contract", contract);
      const consumerContract: ConsumerContract = {
        id: undefined,
        address: contract.address,
        consumerTemplateId: res[0].id,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        owner: contractApi.walletAddress,
        network: contractApi.networkId
      }
      await chainlinkDB.chainLinkDBApi.addConsumerContract(consumerContract)
      const list = await chainlinkDB.chainLinkDBApi.searchConsumerContractByOwnerAndNetwork(contractApi.walletAddress, contractApi.networkId);
      console.log(list);
    } catch (err: any) {
      console.log("err", err)
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
  margin: 32px;
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