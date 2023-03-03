<template>
  <div class="create-edit-request">
    <div class="title">{{ title + ' Script' }}</div>
    <div class="content">Script Content</div>
    <!-- 脚本内容 -->
    <!-- 定义参数名 -->
    <div class="request-box">
      <div class="request-left">
        <ParamsName @submitParamsForm="submitParamsForm"></ParamsName>
        <Requests @submitRequestForm="submitRequestForm"></Requests>
        <Functions @getFunctionData="getFunctionData"></Functions>
        <Returns @submitReturnForm="submitReturnForm" ref="returnFormRef"></Returns>
      </div>
      <div class="request-right">
        <div class="request-right-title">Pipelinefile Preview</div>
        <div class="request-right-content">
          <div class="area">
            <!-- <div>params</div> -->
            <div v-for="item in paramsValue" :key="item.key">{{ item.paramsValue }}</div>
          </div>

          <div class="area">
            <!-- <div>request</div> -->
            <div style="white-space:pre-line" v-for="(item, index) in requestValue" :key="index">{{ item }}</div>
          </div>
          <div class="area">
            <!-- <div>function</div> -->
            <div style="white-space:pre-line">{{ functionValue }}</div>
            <!-- <div v-for="it in functionValue">{{ it }}</div> -->
            <!-- <a-textarea v-model:value="functionValue"></a-textarea> -->
          </div>

          <div class="area">
            <!-- <div>returns</div> -->
            <div>{{ returnsValue }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">Script Param</div>
    <div class="param-left">
      <Secrets @submitSecretsForm="submitSecretsForm" ref="secretsFormRef"></Secrets>
    </div>

    <div class="btn-box">
      <a-button @click="createFunction">Create</a-button>
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
import Secrets from "./components/Secrets.vue";
import type { FormInstance } from 'ant-design-vue';
import dayjs from 'dayjs';
import { ChainLinkDBApi } from "@/db/chainlinkDB"
const chainLinkDBApi = new ChainLinkDBApi();

const { params } = useRoute();
const router = useRouter();
const title = ref('');
const paramsValue = ref([]);
const requestValue = ref([]);
const functionValue = ref('');
const returnsValue = ref('');
const secretsValue = reactive({
  secretsLocation: '',
  secretsURL: '', args: [],
});

const returnFormRef = ref();
const secretsFormRef = ref();

const submitParamsForm = (val: any) => {
  val.map((item: any, key: number) => {
    item.paramsValue = `const ${item.value} = arg[${key}]`
  })
  paramsValue.value = val
  // console.log(val, 'test')
}

const submitRequestForm = (val: any) => {
  console.log(val, 'submitRequestForm')
  setRequestFunction()
}

const setRequestFunction = () => {
  requestValue.value = [];
  const data = JSON.parse(localStorage.getItem('requestsListData')) || [];
  data.map((item: any) => {
    let str = '';
    str += `cosnt ${item.formData.requestName} = Functions.makeHttpRequest({
      url: '${item.formData.URL}',
      method: '${item.formData.method}',
    })

    const [${item.formData.responseName}] = await Promise.all([${item.formData.requestName}])
    `

    requestValue.value.push(str)
  })

}

const getFunctionData = (val: string) => {
  console.log(val, 'val')
  functionValue.value = val
}

const submitReturnForm = (val: any) => {
  returnsValue.value = `return ${val.returnType}(${val.returnParam})`
}

const submitSecretsForm = (val: any) => {
  Object.assign(secretsValue, val)
  console.log(secretsValue.secretsURL, 'jjjj')
  // secretsValue.secretsURL = 
}

const createFunction = async () => {
  returnFormRef.value.submitForm();
  await secretsFormRef.value.submitForm()
  console.log(secretsValue, 'ppp')

  // console.log(secretsFormRef.value, 'ppp')


  let source = returnsValue.value + functionValue.value;
  const data = {
    id: Date.now(),
    addTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    source: source,
    scerets: {
      secretsLocation: secretsValue.secretsLocation,
      secretsURL: secretsValue.secretsURL
    },
  }
  console.log(data, secretsValue.secretsURL, 'data')


  // console.log(source, returnsValue.value, '000')

  // chainLinkDBApi.addRequest(data).then(res => {
  //   console.log(res, '999')
  // })
}

const backPage = () => {
  localStorage.removeItem('requestsListData');
  router.go(-1);
}

onMounted(() => {
  chainLinkDBApi.open()
  setRequestFunction()
  title.value = params.type === '1' ? 'Create' : 'Edit';
})

</script>
<style lang='scss' scoped>
.create-edit-request {
  max-width: 1440px;
  margin: 96px 32px 32px;
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
  }
}
</style>