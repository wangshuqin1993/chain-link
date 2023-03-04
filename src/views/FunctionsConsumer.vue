<template>
  <div class="functions-consumer-view">
    <a-button class="create-btn" @click="createConsumer">Create FunctionsConsumer</a-button>
    <a-table :columns="columns" :dataSource="consumerList" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="detailConsumer(record)">Detail</a>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="visible" title="Create FunctionsConsumer" :footer="null">
    <div>
      <a-form :modal="deployModal" layout="vertical">
        <a-form-item label="Contract Template">
          <a-select ref="select" v-model:value="deployModal.id">
            <a-select-option value="Basic Template">Basic Template</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Functions Oracle Address">
          <a-input v-model:value="deployModal.address" disabled></a-input>
        </a-form-item>
      </a-form>
    </div>
    <div class="modal-btn">
      <a-button @click='visible = false'>Cancel</a-button>
      <a-button @click="deployBtn" :loading="loading">Deploy</a-button>
    </div>
  </a-modal>

  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { message } from "ant-design-vue";
import Wallets from "../components/Wallets.vue";
import * as ethers from "ethers";
import { useOnboard } from '@web3-onboard/vue'
import { useChainlinkDB, useContractApi } from "@/stores/useStore";
import { networkConfig } from "@/api/contractConfig";
import { ConsumerContract } from "@/db/chainlinkDB";
import dayjs from "dayjs";
import router from "@/router";
const { connectedWallet } = useOnboard();
const chainlinkDB = useChainlinkDB()
const contractApi = useContractApi()

const deployModal = reactive({
  id: 'Basic Template',
  address: '0x0'
})




// const dataSource = ref([{ contractAddress: '1234567dfghu', createdTime: '2023-02-28', id: 2343 }]);
const consumerList = ref([]);
const visible = ref(false);
const loading = ref(false);
const showWallets = ref();
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Contract Address',
    dataIndex: 'address',
    align: "center",
    key: 'address',
    // customRender: ({ text }) => {
    //   if (text) {
    //     return text.substring(0, 5) + "..." + text.substring(text.length - 4)
    //   } else {
    //     return '-'
    //   }
    // }
  },
  {
    title: 'Created',
    dataIndex: 'createTime',
    align: "center",
    key: 'createTime',
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

const createConsumer = () => {
  visible.value = true;
  //getAllTemplateList();
}

const detailConsumer = (val: any) => {
  router.push(`/consumer-detail/${val.id}`)
}

const deployBtn = async () => {
  console.log("start")
  if (contractApi.apiStatus && chainlinkDB.apiStatus) {
    loading.value = true;
    let res = await chainlinkDB.chainLinkDBApi.getAllConsumerTemplate();
    console.log(res, "provider", contractApi.provider)
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
      consumerList.value = list;
      loading.value = false;
      visible.value = false;
    } catch (err: any) {
      console.log("err", err)
      message.error(err)
    } finally {
      loading.value = false;
    }
  }
}

const getAllTemplateList = async () => {
  console.log('iiiii')
  let res = await chainlinkDB.chainLinkDBApi.getAllConsumerTemplate();
  console.log(res, 'getAllConsumerTemplate')
}

const getConsumerList = () => {
  if (contractApi.apiStatus && chainlinkDB.apiStatus) {
    chainlinkDB.chainLinkDBApi.searchConsumerContractByOwnerAndNetwork(contractApi.walletAddress, contractApi.networkId).then(res => {
      consumerList.value = res;
    });
  }
}

onMounted(() => {
})

watch([() => chainlinkDB.networkId, () => chainlinkDB.apiStatus],
  (newValues, oldValues) => {
    if (newValues[0] && newValues[1]
      && (newValues[0] != oldValues[0]
        || newValues[1] != oldValues[1])
    ) {
      getConsumerList()
      deployModal.address = networkConfig[contractApi.networkId].functionsOracleProxy
    }
  }, {
  deep: true,
  immediate: true
});

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

:deep(.ant-form-item-label>label) {
  width: 200px;
}
</style>