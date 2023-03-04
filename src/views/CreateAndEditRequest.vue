<template>
  <div class="create-edit-request">
    <div class="title">{{ title + ' Request' }}</div>

    <div class="param-left">
      <a-form :modal="updateFormData" layout="vertical">
        <a-form-item label="Request Name" :rules="[{ required: true }]">
          <a-input v-model:value="updateFormData.name"></a-input>
        </a-form-item>
      </a-form>
    </div>

    <div class="content">Request Config</div>
    <div class="param-left">
      <RequestConfig @submitRequestConfigForm="submitRequestConfigForm" ref="requestConfigFormRef"
        :requestConfigData="updateFormData.requestConfig">
      </RequestConfig>
    </div>

    <div class="content">Request Content</div>

    <!-- 定义参数名 -->
    <div class="request-box">
      <div class="request-left">
        <ParamsName @submitParamsForm="submitParamsForm" :paramsData="updateFormData.paramsValue"></ParamsName>
        <Requests @submitRequestForm="submitRequestForm" :requsetData="updateFormData.requsetValue"></Requests>
        <Functions @getFunctionData="getFunctionData" :functionData="updateFormData.calculation"></Functions>
        <Returns @submitReturnForm="submitReturnForm" ref="returnFormRef" :returnData="updateFormData.returnValue">
        </Returns>
      </div>
      <div class="request-right">
        <div class="request-right-title">Pipelinefile Preview</div>
        <div class="request-right-content">
          <div class="area">
            <div v-for="item in paramsValue" :key="item.key">{{ item.paramsValue }}</div>
          </div>
          <div class="area">
            <div style="white-space:pre-line" v-for="(item, index) in requestValue" :key="index">{{ item }}</div>
          </div>
          <div class="area">
            <div style="white-space:pre-line">{{ functionValue }}</div>
          </div>
          <div class="area">
            <div>{{ returnsValue }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <a-button @click="createFunction">{{ buttonInfo }}</a-button>
      <a-button @click="backPage">Back</a-button>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from 'vue-router';
import ParamsName from './components/ParamsName.vue';
import Requests from './components/Requests.vue';
import Functions from "./components/Functions.vue";
import Returns from "./components/Returns.vue";
import RequestConfig from "./components/RequestConfig.vue";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ChainLinkDBApi } from "@/db/chainlinkDB"
import { element } from "svelte/internal";
const chainLinkDBApi = new ChainLinkDBApi();

const { params } = useRoute();
const router = useRouter();
const title = ref('');
const buttonInfo = ref('');
const paramsValue = ref([]);
const requestValue = ref([]);
const functionValue = ref('');
const returnsValue = ref('');
const requestConfigValue = reactive({});
const returnDBData = reactive({});
const requestDBdata = ref([]);
const returnFormRef = ref();
const requestConfigFormRef = ref();
const updateFormData = reactive({});

const submitParamsForm = (val: any) => {
  val.map((item: any, key: number) => {
    if (item.value !== '') {
      item.paramsValue = `const ${item.value} = arg[${key}]`
    }
  })
  paramsValue.value = val
}

const submitRequestForm = (val: any) => {
  // console.log(val, '999999999999')
  Object.assign(requestDBdata.value, val);
  val.forEach((item: any) => {
    setRequestFunction(item)
  })
  // setRequestFunction(val)
}

const setRequestFunction = async (data: any) => {
  requestValue.value = [];
  let str = '';
  str += `
    cosnt ${data.formData.requestName} = Functions.makeHttpRequest({
    url: ${data.formData.URL},
    method: ${data.formData.method},`

  const hearders = await setMapList(data.formData.headers);
  const params = await setMapList(data.formData.params);
  const datas = await setMapList(data.formData.data);


  if (hearders) {
    str +=
      `
      header: {${hearders}},
     `
  }
  if (params) {
    str +=
      `params: {${params}},
     `
  }

  if (datas) {
    str +=
      ` data: {${datas}},
    `
  }

  str +=
    `timeout: ${data.formData.timeout},
    responseType: ${data.formData.responseType},
    })

    const [${data.formData.responseName}] = await Promise.all([${data.formData.requestName}])
  `
  requestValue.value.push(str);
}


const setMapList = (data: any) => {
  let str = ''
  data.map((item: any) => {
    if (item.value && item.value !== '') {
      str += `${item.key}: ${item.value},`
    }
  })
  str = str.substring(0, str.length - 1);
  console.log(str, 'str')
  return str
}

const getFunctionData = (val: string) => {
  // console.log(val, 'val')
  functionValue.value = val;
}

const submitReturnForm = (val: any) => {
  Object.assign(returnDBData, val);
  returnsValue.value = `return ${val.returnType}(${val.returnParam})`;
}

const submitRequestConfigForm = (val: any) => {
  Object.assign(requestConfigValue, val)
  // console.log(requestConfigValue.secretsURL, 'jjjj')
}

const generateRequestSource = () => {
  let source = '';
  paramsValue.value.forEach(item => {
    source += item.paramsValue;
    source += '\n';
  });
  requestValue.value.forEach(item => {
    source += item;
    source += '\n';
  });
  source += functionValue.value;
  source += '\n';
  source += returnsValue.value;
  console.log(source);
  return source;
}

const createFunction = async () => {
  returnFormRef.value.submitForm();
  await requestConfigFormRef.value.submitForm()

  // data1 = JSON.parse(JSON.stringify(paramsValue.value))
  // console.log(requestConfigValue,data1, 'ppp')
  let source = generateRequestSource();
  const data = {
    id: updateFormData.id || Date.now(),
    name: updateFormData.name,
    addTime: updateFormData.addTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
    source: source,
    requestConfig: updateFormData.requestConfig || JSON.parse(JSON.stringify(requestConfigValue)),
    paramsValue: JSON.parse(JSON.stringify(paramsValue.value)),
    requsetValue: JSON.parse(JSON.stringify(requestDBdata.value)),
    calculation: functionValue.value,
    returnValue: JSON.parse(JSON.stringify(returnDBData)),
  }

  if (params.type === '1') {
    chainLinkDBApi.addRequest(data).then(res => {
      // console.log(res, '999')
      message.success('Create Success');
      router.go(-1);
    })
  } else {
    chainLinkDBApi.updateRequest(data).then(res => {
      message.success('Edit Success');
      router.go(-1);
    })
  }
}

const backPage = () => {
  localStorage.removeItem('requestsListData');
  router.go(-1);
}

const searchRequest = () => {
  let id = Number(params.id);
  chainLinkDBApi.searchRequestById(id).then(res => {
    // console.log(res, 'tttttt')
    Object.assign(updateFormData, res)
  })
}

onMounted(async () => {
  title.value = params.type === '1' ? 'Create' : 'Edit';
  buttonInfo.value = params.type === '1' ? 'Create' : 'Edit';
  await chainLinkDBApi.open();
  if (params.type === '2') {
    searchRequest();
  }
})

</script>
<style lang='scss' scoped>
.create-edit-request {
  max-width: 1440px;
  margin: 32px;
  text-align: left;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;

  .title {
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 700;
    color: #1a2b6b;
  }

  .content {
    padding-bottom: 8px;
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 700;
    color: #1a2b6b;
    border-bottom: 1px solid #e7e8ea;
  }

  .param-left {
    width: calc(50% - 32px);
  }
}

.area {
  margin-bottom: 64px;
}

.btn-box {
  text-align: center;

  .ant-btn {
    width: 132px;
    height: 42px;
    font-weight: 700;

    &:first-child {
      color: #375bd2;
      border-color: #375bd2;

      margin-right: 16px;
    }
  }
}

.request-box {
  display: flex;

  .request-left {
    margin-right: 32px;
  }

  .request-right {
    margin-left: 32px;

    .request-right-title {
      background-color: #D9D9D9;
      font-size: 16px;
      font-weight: 700;
      padding: 24px;
      border-radius: 8px 8px 0 0;
    }

    .request-right-content {
      background-color: #F7F8F9;
      border-radius: 0 0 8px 8px;
      padding: 24px;
    }
  }

  .request-left,
  .request-right {
    flex: 1;
    max-width: 50%;
  }
}
</style>