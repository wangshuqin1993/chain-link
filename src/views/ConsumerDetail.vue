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
      <div class="execute-list-title">Execute List</div>
      <a-table :columns="execColumns" :dataSource="executeList" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="getOCRResponse(record)">Get Result</a>
          </template>
        </template>
      </a-table>
    </div>

  </div>

  <a-modal v-model:visible="visible" title="Send Request" :footer="null">
    <a-form :model="requestModal" ref="formRef">
      <a-form-item label="subscriptionId" :rules="{ required: true }">
        <a-select v-model:value="requestModal.subscriptionId" :options="subscriptionsList" />
      </a-form-item>

      <a-form-item label="requestId" :rules="{ required: true }">
        <a-select v-model:value="requestModal.requestId" :options="requestList" @change="changeRequestId" />
      </a-form-item>

      <a-form-item label="secretsLocation" :rules="{ required: false }">
        <a-input v-model:value="selectRequestModalData.secretsLocationName" disabled></a-input>
      </a-form-item>

      <a-form-item label="secretsURL" :rules="{ required: false }" v-if="selectRequestModalData.secretsURL">
        <a-input v-model:value="selectRequestModalData.secretsURL" disabled></a-input>
      </a-form-item>

      <a-space v-for="(secretItem, index) in selectRequestModalData.secrets" :key="secretItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline" v-if="selectRequestModalData.secretsResult">
        <a-form-item :name="['secrets', index, 'key']" :label="index === 0 ? 'secrets' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="secretItem.key" disabled />
        </a-form-item>
        <a-form-item label="" :name="['secrets', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="secretItem.value" disabled />
        </a-form-item>
      </a-space>

      <a-space v-for="(argItem, index) in selectRequestModalData.args" :key="argItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline" v-if="selectRequestModalData.argsResult">
        <a-form-item :name="['args', index, 'key']" :label="index === 0 ? 'secrets' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="argItem.key" disabled />
        </a-form-item>
        <a-form-item label="" :name="['args', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="argItem.value" disabled />
        </a-form-item>
      </a-space>

      <div class="btn-box">
        <a-button class="confirm-btn" @click="clickSend">Confirm</a-button>
        <a-button @click="cancelBtn">cancel</a-button>
      </div>
    </a-form>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref, watch, reactive, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChainlinkDB, useContractApi } from "@/stores/useStore";
import { FormInstance, Modal } from 'ant-design-vue';
import { ConsumerApi } from "@/api/consumerApi";
import { networkConfig } from "@/api/contractConfig";
import { ethers } from "ethers";
import { encryptWithPublicKey } from "@/utils/encryptSecrets";
import { ExecuteRequest } from "@/db/chainlinkDB";
import dayjs from "dayjs";
const chainlinkDB = useChainlinkDB();
const contractApi = useContractApi();
const consumerApi = shallowRef();
const router = useRouter();
const { params } = useRoute();
const detailList = ref([]);
const executeList: Ref<ExecuteRequest[]> = ref([]);
const visible = ref(false);
const formRef = ref<FormInstance>();

const requestModal = ref({
  subscriptionId: '',
  requestId: '',
});

const selectRequestModalData = reactive({});

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

const execColumns = [
  {
    title: 'RequestId',
    dataIndex: 'execId',
    align: "center",
    key: 'execId',
  },
  {
    title: 'Subscription',
    dataIndex: 'subscriptionId',
    align: "center",
    key: 'subscriptionId',
  },
  {
    title: 'Request Config',
    dataIndex: 'requestId',
    align: "center",
    key: 'requestId',
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
    const data = requestList.value.find(item => { return item.id == requestModal.value.requestId });
    console.log(data, 'data')
    const source = data.source;
    const secretsLocation = Number(data.requestConfig.secretsLocation);
    const secrets = await buildSecrets(data.requestConfig.secrets, data.requestConfig.secretsURL, secretsLocation);
    const args = data.paramsValue.filter(t => t.value).map(t => t.value);
    const subscriptionId = requestModal.value.subscriptionId;
    const gasLimit = 100000;
    console.log(source)
    console.log("args", args)
    console.log("secrets", secrets)
    console.log("secretsLocation", secretsLocation)
    console.log("subscriptionId", subscriptionId)
    console.log("address", consumerApi.value.contract.address);
    consumerApi.value.executeRequest(source, secrets, secretsLocation, args, subscriptionId, gasLimit).then(receipt => {
      console.log(receipt, 'res')
      consumerApi.value.latestRequestId().then(execId => {
        console.log("requestId", execId);
        const executRequest: ExecuteRequest = {
          execId: execId,
          requestId: Number(data.id),
          consumerContractId: Number(params.id),
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          owner: contractApi.walletAddress,
          secrets: secrets,
          secretsLocation: secretsLocation.toFixed(),
          args: args,
          subscriptionId: Number(subscriptionId),
          gasLimit: gasLimit
        }
        addEcecute(executRequest);
        visible.value = false;
      })
    })
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
      return "0x" + await encryptWithPublicKey(DONPublicKey, JSON.stringify(payload));
    }
  }
  if (secretsLocation === 1) {
    if (Array.isArray(secretsURLs) && secretsURLs.length > 0) {
      return "0x" + await encryptWithPublicKey(DONPublicKey, secretsURLs.join(" "))
    }
  }
  return "";
}


const addEcecute = (executRequest: ExecuteRequest) => {
  chainlinkDB.chainLinkDBApi.addExecuteRequest(executRequest).then(res => { getExecuteList() })
}


const getExecuteList = () => {
  // chainlinkDB.chainLinkDBApi.searchExecuteRequestByConsumerContractId().then(res => { console.og(res) executeList.value = res})
}

const changeRequestId = (val: any) => {
  const data = requestList.value.find(item => { return item.id == val });
  const { requestConfig } = data;
  const argsResult = requestConfig.args.some(val => { return val.value !== '' });
  const secretsResult = requestConfig.secrets.some(val => { return val.value !== '' });
  selectRequestModalData.secretsLocationName = requestConfig.secretsLocation === '1' ? 'Remote' : 'Inline';
  selectRequestModalData.argsResult = argsResult;
  selectRequestModalData.secretsResult = secretsResult;
  Object.assign(selectRequestModalData, requestConfig);
  // console.log(selectRequestModalData, 'data')
}

const getOCRResponse = (record) => {
  consumerApi.value.eventOCRResponse(record.execId).then(res => {
    let message = "";
    if (res.length > 0) {
      if (res[0].args[2] === "0x") {
        message = `The current result is returned correctly, and the returned data is: ${res[0].args[1]}`
      } else {
        message = "Return result error"
      }
    } else {
      message = "Currently no results are returned"
    }
    Modal.info({
      title: 'This is a request result message',
      content: h('div', {}, [
        h('p', message),
      ]),
    });
    console.log("OCRResponse", res);
  })
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
      item.value = item.name;
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

const cancelBtn = () => {
  visible.value = false;
  formRef.value.resetFields();
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
      getExecuteList();
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
    width: 132px;
    font-weight: 700;
    margin: 0 12px;
  }

  .confirm-btn {
    color: #375bd2;
    border-color: #375bd2;
  }
}
</style>