<template>
  <div class="create-edit-request">
    <div class="title">{{ title + ' FunctionRequest' }}</div>

    <!-- 脚本内容 -->
    <!-- 定义参数名 -->
    <div class="request-box">
      <div class="request-left">
        <ParamsName @submitParamsForm="submitParamsForm"></ParamsName>
        <Requests @submitRequestForm="submitRequestForm"></Requests>
        <Functions @getFunctionData="getFunctionData"></Functions>
        <Returns @submitReturnForm="submitReturnForm"></Returns>
      </div>
      <div class="request-right">
        显示区
        <div>
          <div>params</div>
          <div v-for="item in paramsValue" :key="item.key">{{ item.paramsValue }}</div>
        </div>

        <div>
          <div>request</div>
          <div>{{ requestValue }}</div>
        </div>
        <div>
          <div>function</div>
          <!-- <div v-for="it in functionValue">{{ it }}</div> -->
          <a-textarea v-model:value="functionValue"></a-textarea>
        </div>

        <div>
          <div>returns</div>
          <div>{{ returnsValue }}</div>
        </div>
      </div>
    </div>
    <div>
    </div>


  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute } from 'vue-router';
import ParamsName from './components/ParamsName.vue';
import Requests from './components/Requests.vue';
import Functions from "./components/Functions.vue";
import Returns from "./components/Returns.vue";
const { params } = useRoute()
const title = ref('');
const paramsValue = ref([]);
const requestValue = ref('');
const functionValue = ref('');
const returnsValue = ref('');

const submitParamsForm = (val: any) => {
  val.map((item: any, key: number) => {
    item.paramsValue = `const ${item.value} = arg[${key}]`
  })
  paramsValue.value = val
  // console.log(val, 'test')
}

const submitRequestForm = (val: any) => {
  console.log(val, 'submitRequestForm')
  setRequestFunction(val.formData)
}

const setRequestFunction = () => {
  const data = JSON.parse(localStorage.getItem('requestsListData'))[0];
  console.log(data, '99')
  let str = [];
  // str += `cosnt ${data.formData.requestName} = Functions.makeHttpRequest({
  //   url: '${data.formData.URL}',
  //   method: '${data.formData.method}',
  //   headers: ${data.formData.headers}
  // })`

  // requestValue.value = str
}

const getFunctionData = (val: string) => {
  console.log(val, 'val')
  functionValue.value = val
}

const submitReturnForm = (val: any) => {
  returnsValue.value = `return ${val.returnType}(${val.returnParam})`
}



onMounted(() => {
  setRequestFunction()
  title.value = params.type === '1' ? 'Create' : 'Edit';
})

</script>
<style lang='scss' scoped>
.create-edit-request {
  max-width: 1920px;
  margin: 32px;
  text-align: left;

  .title {
    margin-bottom: 32px;
    font-size: 24px;
    font-weight: 700;
    color: #1a2b6b;
  }
}

.request-box {
  display: flex;

  .request-left,
  .request-right {
    flex: 1;
  }
}

// .dynamic-delete-button {
//   cursor: pointer;
//   position: relative;
//   top: 4px;
//   font-size: 24px;
//   color: #999;
//   transition: all 0.3s;
// }

// .dynamic-delete-button:hover {
//   color: #777;
// }

// .dynamic-delete-button[disabled] {
//   cursor: not-allowed;
//   opacity: 0.5;
// }
</style>