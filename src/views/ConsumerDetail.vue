<template>
  <div class="consumer-detail">
    <!-- <div class="title">ConsumerDetail</div> -->
    <a-breadcrumb>
      <a-breadcrumb-item><a href="javascript:;" @click="back">FunctionsConsumer</a></a-breadcrumb-item>
      <a-breadcrumb-item>Consumer Detail</a-breadcrumb-item>
    </a-breadcrumb>

    <a-table :columns="columns" :dataSource="detailList" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="sendRequest(record)">Send Request</a>
        </template>
      </template>
    </a-table>

    <div v-if="executeList.length > 0">
      <div class="execute-list-title">ExecuteList</div>
      <a-table :columns="columns" :dataSource="executeList" :pagination="false">
      </a-table>
    </div>

  </div>

  <a-modal v-model:visible="visible" title="Send Request" :footer="null">
    <a-form :model="requestModal" ref="formRef">
      <a-form-item label="subscriptionId" :rules="{ required: false }">
        <a-select v-model:value="requestModal.subscriptionId" :options="subscriptionsList" />
      </a-form-item>
      <a-form-item label="requestId" :rules="{ required: false }">
        <a-select v-model:value="requestModal.requestId" :options="requestList" />
      </a-form-item>
      <div class="btn-box">
        <a-button @click="clickSend">Send Request</a-button>
      </div>
    </a-form>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChainlinkDB, useContractApi } from "@/stores/useStore";
import type { FormInstance } from 'ant-design-vue';
import { ConsumerApi } from "@/api/consumerApi";
import { networkConfig } from "@/api/contractConfig";
import { ethers } from "ethers";
import { encryptWithPublicKey } from "@/utils/encryptSecrets";
const chainlinkDB = useChainlinkDB();
const contractApi = useContractApi();
const consumerApi = ref();
const router = useRouter();
const { params } = useRoute();
const detailList = ref([]);
const executeList = ref([]);
const visible = ref(false);
const formRef = ref<FormInstance>();

const requestModal = ref({
  subscriptionId: '',
  requestId: '',
});

const requestList = ref([]);
const subscriptionsList = ref([]);

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
    dataIndex: 'action',
    align: "center",
    key: 'action',
  }
]


const clickSend = async () => {
  // console.log(subscriptionsList.value, 'requestModal')
  try {
    await formRef.value.validate();
    const data = requestList.value.find(item => { return item.id == requestModal.value.requestId })
    console.log(data, 'data')
    const source = data.source;
    const secretsLocation = Number(data.requestConfig.secretsLocation);
    const secrets = await buildSecrets(data.requestConfig.secrets, data.requestConfig.secretsURL, secretsLocation);
    const args = data.paramsValue.filter(t => t.value).map(t => t.value);
    const subscriptionId = requestModal.value.subscriptionId;
    const gasLimit = 100000;
    console.log(source, secretsLocation, gasLimit, secrets, args, subscriptionId)
    // consumerApi.value.executeRequest(source, secrets, secretsLocation, args, subscriptionId, gasLimit).then(res => {
    //   console.log(res, 'res')
    //   addEcecute();
    // })
  } catch (error) {
    console.log('error', error);
  }
};

const buildSecrets = async (secrets, secretsURLs, secretsLocation) => {
  const DONPublicKey = networkConfig[contractApi.networkId].functionsPublicKey;
  const provider = new ethers.providers.Web3Provider(contractApi.provider)
  const singer = provider.getSigner();
  if (secretsLocation === 0) {
    if (Array.isArray(secrets) && secrets.length > 0) {
      const obj = secrets.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {});
      const message = JSON.stringify(obj);
      const messageHash = ethers.utils.solidityKeccak256(['string'], [message])
      const signature = await singer.signMessage(ethers.utils.arrayify(messageHash))
      const payload = {
        message,
        signature,
      };
      return "0x" + encryptWithPublicKey(DONPublicKey, JSON.stringify(payload));
    }
  }
  if (secretsLocation === 1) {
    if (Array.isArray(secretsURLs) && secretsURLs.length > 0) {
      return "0x" + encryptWithPublicKey(DONPublicKey, secretsURLs.join(" "))
    }
  }
  return "";
}


const addEcecute = () => {
  // chainlinkDB.chainLinkDBApi.addExecuteRequest().then(res => { getExecuteList(); console.og(res) })
}


const getExecuteList = () => {
  // chainlinkDB.chainLinkDBApi.searchExecuteRequestByConsumerContractId().then(res => { console.og(res) executeList.value = res})
}


const getContractDetail = () => {
  if (contractApi.apiStatus && chainlinkDB.apiStatus) {
    chainlinkDB.chainLinkDBApi.getConsumerContract(Number(params.id)).then(res => {
      //console.log(res, '9090')
      if (res?.address) {
        consumerApi.value = new ConsumerApi(contractApi.provider, res.address);
      }
      detailList.value = [res]
    })
  }
}

const getSubscriptions = () => {
  chainlinkDB.chainLinkDBApi.getAllSubscriptions().then(res => {
    // console.log(res, '9090')
    res.map((item: any) => {
      item.lable = item.id;
      item.value = item.id;
      subscriptionsList.value.push(item)
    })
  })
}

const getRequestList = () => {
  chainlinkDB.chainLinkDBApi.getAllRequests().then(res => {
    // console.log(res, 'getValue')
    res.map((item: any) => {
      item.lable = item.id;
      item.value = item.id;
      requestList.value.push(item)
    })
    console.log(requestList.value, '999')
    // requestList.value
    // requestList.value = res
  })
}

const sendRequest = async (val: any) => {
  visible.value = true;
}


const back = () => {
  router.go(-1);
}

watch([() => chainlinkDB.networkId, () => chainlinkDB.apiStatus],
  (newValues, oldValues) => {
    if (newValues[0] && newValues[1]
      && (newValues[0] != oldValues[0]
        || newValues[1] != oldValues[1])
    ) {
      getContractDetail();
      getSubscriptions();
      getRequestList();
    }
  }, {
  deep: true,
  immediate: true
});
</script>
<style lang='scss' scoped>
.consumer-detail {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin: 32px;
  text-align: left;

  .execute-list-title {
    margin: 32px 0 16px;
    font-size: 18px;
    font-weight: 700;
    color: #1a2b6b;
  }

  .title {
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 700;
    color: #1a2b6b;
  }
}

.ant-breadcrumb {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
}

:deep(.ant-form-item-label>label) {
  width: 124px;
}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item) {
  line-height: 40px;
}

:deep(.ant-breadcrumb-link a) {
  cursor: pointer;

  &:hover {
    color: #375bd2;
  }
}

.btn-box {
  text-align: center;

  .ant-btn {
    font-size: 700;
    color: #375bd2;
    border-color: #375bd2;
  }
}
</style>