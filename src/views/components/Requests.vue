<template>
  <div class="title">Define Request Method</div>
  <div class="requests-list" v-if="requestsList.length > 0">
    <div v-for="item in requestsList" :key="item.id" class="list-item">
      <div class="item-info-box">
        <div class="item item-requestName">
          <span class="item-title">requestName: </span>
          <span class="item-info">{{ item.formData.requestName }}</span>
        </div>
        <div class="item item-responseName">
          <span class="item-title">responseName: </span>
          <span class="item-info">{{ item.formData.responseName }}</span>
        </div>
        <div class="item item-url">
          <span class="item-title">URL: </span>
          <span class="item-info">{{ item.formData.URL }}</span>
        </div>
        <div class="item item-method" v-if="item.formData.Method">
          <span class="item-title">Method: </span>
          <span class="item-info">{{ item.formData.Method }}</span>
        </div>
        <div class="item item-method" v-if="item.formData.showHeader">
          <span class="item-title">headers: </span>
          <span class="item-info" v-for="val in item.formData.headers">{{ val.key + ': ' + val.value + ', ' }}</span>
        </div>
        <div class="item item-method" v-if="item.formData.showParams">
          <span class="item-title">params: </span>
          <span class="item-info" v-for="val in item.formData.params">{{ val.key + ': ' + val.value }}</span>
        </div>
        <div class="item item-method" v-if="item.formData.showData">
          <span class="item-title">data: </span>
          <span class="item-info" v-for="val in item.formData.data">{{ val.key + ': ' + val.value }}</span>
        </div>
        <div class="item item-url">
          <span class="item-title">timeout: </span>
          <span class="item-info">{{ item.formData.timeout }}</span>
        </div>
        <div class="item item-url">
          <span class="item-title">responseType: </span>
          <span class="item-info">{{ item.formData.responseType }}</span>
        </div>
      </div>

      <div class="view-all">
        <span class="view" @click="viewAll(item.id)">View All</span>
        <span class="delete" @click="deleteRequest(item)">Delete</span>
      </div>
    </div>

  </div>

  <div class="requests-header">
    <a-button type="dashed" style="width: 100%" @click="addRequest">
      <PlusOutlined />
      Add New Request Method
    </a-button>
  </div>
  <a-modal v-model:visible="addRequestsVisible" title="Add New Request Method" :footer="null" width="658px"
    @cancel="cancel">
    <a-form ref="formRef" :model="addRequestsForm">
      <a-form-item name="requestName" label="requestName" :rules="[{ required: true, message: 'Missing requestName' }]">
        <a-input v-model:value="addRequestsForm.requestName" placeholder="please input requestName"
          autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item name="responseName" label="responseName"
        :rules="[{ required: true, message: 'Missing responseName' }]">
        <a-input v-model:value="addRequestsForm.responseName" placeholder="please input responseName"
          autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item name="URL" label="URL" :rules="[{ required: true, message: 'Missing URL' }]">
        <a-input v-model:value="addRequestsForm.URL" placeholder="please input URL" autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item name="method" label="Method" :rules="[{ required: false }]">
        <a-select v-model:value="addRequestsForm.method" :options="methodsList" />
      </a-form-item>

      <a-space v-for="(headerItem, index) in addRequestsForm.headers" :key="headerItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['headers', index, 'key']" :label="index === 0 ? 'Headers' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="headerItem.key" autocomplete="off" />
        </a-form-item>
        <a-form-item label="" :name="['headers', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="headerItem.value" autocomplete="off" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addHeader" />
        <MinusCircleOutlined v-if="index > 0" @click="removeHeader(headerItem)" />
      </a-space>


      <a-space v-for="(paramItem, index) in addRequestsForm.params" :key="paramItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['params', index, 'key']" :label="index === 0 ? 'params' : ' '" :rules="{ required: false }">
          <a-input v-model:value="paramItem.key" autocomplete="off" />
        </a-form-item>
        <a-form-item label="" :name="['params', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="paramItem.value" autocomplete="off" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addParams" />
        <MinusCircleOutlined v-if="index > 0" @click="removeParams(paramItem)" />
      </a-space>

      <a-space v-for="(dataItem, index) in addRequestsForm.data" :key="dataItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['data', index, 'key']" :label="index === 0 ? 'data' : ' '" :rules="{ required: false }">
          <a-input v-model:value="dataItem.key" autocomplete="off" />
        </a-form-item>
        <a-form-item label="" :name="['data', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="dataItem.value" autocomplete="off" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addData" />
        <MinusCircleOutlined v-if="index > 0" @click="removeData(dataItem)" />
      </a-space>



      <a-form-item name="timeout" label="timeout" :rules="[{ required: false }]">
        <a-input v-model:value="addRequestsForm.timeout" placeholder="please input timeout" autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item name="responseType" label="responseType" :rules="[{ required: false }]">
        <a-input v-model:value="addRequestsForm.responseType" placeholder="please input responseType"
          autocomplete="off"></a-input>
      </a-form-item>

      <a-form-item class="btn-box">
        <a-button type="primary" html-type="submit" @click="submitForm">Add</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance } from 'ant-design-vue';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
const formRef = ref<FormInstance>();
const addRequestsForm = reactive({
  requestName: '',
  responseName: '',
  URL: '',
  method: 'GET',
  headers: [{ key: '', value: '', id: Date.now() }],
  params: [{ key: '', value: '', id: Date.now() }],
  data: [{ key: '', value: '', id: Date.now() }],
  timeout: 6000,
  responseType: 'json',
});
const addRequestsVisible = ref(false);
const methodsList = ref([
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' }
]);
// const requestsList = ref(JSON.parse(localStorage.getItem('requestsListData'))) || ref([]);
const requestsList = ref([]);
const viewAllId = ref(0);

console.log(requestsList.value, 'requestsList')

interface Sights {
  value: string;
  price: string;
  id: number;
};

const props = defineProps({
  requsetData: Array,
})

const emit = defineEmits(["submitRequestForm"])

const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      addRequestsForm.showHeader = addRequestsForm.headers.some((val: any) => { return val.value && val.value !== '' });
      addRequestsForm.showParams = addRequestsForm.params.some((val: any) => { return val.value && val.value !== '' });
      addRequestsForm.showData = addRequestsForm.data.some((val: any) => { return val.value && val.value !== '' });
      addRequestsVisible.value = false;
      requestsList.value = JSON.parse(localStorage.getItem('requestsListData')) || [];
      if (requestsList.value && requestsList.value.length > 0) {
        const result = requestsList.value.find((val: any) => { return val.id === viewAllId.value })
        if (result) {
          // console.log('修改')
          // console.log(addRequestsForm, 'addRequestsForm')
          requestsList.value.map((item: any) => {
            if (item.id === viewAllId.value) {
              Object.assign(item.formData, addRequestsForm)
            }
          })
          localStorage.setItem('requestsListData', JSON.stringify(requestsList.value));
        } else {
          // console.log('新增');
          requestsList.value.push({ id: Date.now(), formData: addRequestsForm })
        }
      } else {
        requestsList.value.push({ id: Date.now(), formData: addRequestsForm })
      }
      localStorage.setItem('requestsListData', JSON.stringify(requestsList.value));
      emit('submitRequestForm', requestsList.value);

    })
}


const viewAll = (id: number) => {
  viewAllId.value = id;
  requestsList.value = JSON.parse(localStorage.getItem('requestsListData'));
  const data = JSON.parse(localStorage.getItem('requestsListData'));
  if (data) {
    data.map((item: any) => {
      if (item.id === id) {
        Object.assign(addRequestsForm, item.formData);
      }
    })
  } else {
    Object.assign(addRequestsForm, {});
  }
  addRequestsVisible.value = true;
}

const resetForm = () => {
  formRef.value.resetFields();
};

const cancel = () => {
  viewAllId.value = 0
}

const addRequest = () => {
  addRequestsVisible.value = true;
  formRef.value.resetFields();

}

const deleteRequest = (item: any) => {
  let index = requestsList.value.indexOf(item);
  if (index !== -1) {
    requestsList.value.splice(index, 1);
  }
  localStorage.setItem('requestsListData', JSON.stringify(requestsList.value));
  emit('submitRequestForm', requestsList.value)
}

const removeHeader = (item: Sights) => {
  let index = addRequestsForm.headers.indexOf(item);
  if (index !== -1) {
    addRequestsForm.headers.splice(index, 1);
  }
};

const addHeader = () => {
  addRequestsForm.headers.push({
    key: undefined,
    value: undefined,
    id: Date.now()
  });
};

const removeParams = (item: Sights) => {
  let index = addRequestsForm.params.indexOf(item);
  if (index !== -1) {
    addRequestsForm.params.splice(index, 1);
  }
};

const addParams = () => {
  addRequestsForm.params.push({
    key: undefined,
    value: undefined,
    id: Date.now()
  });
}

const removeData = (item: Sights) => {
  let index = addRequestsForm.data.indexOf(item);
  if (index !== -1) {
    addRequestsForm.data.splice(index, 1);
  }
};

const addData = () => {
  addRequestsForm.data.push({
    key: undefined,
    value: undefined,
    id: Date.now()
  });
}

watch(() => props.requsetData,
  (val) => {
    if (val) {
      requestsList.value = val;
      localStorage.setItem('requestsListData', JSON.stringify(requestsList.value));
      emit('submitRequestForm', requestsList.value)
    }
  }, {
  deep: true,
  immediate: true
})

</script>

<style scoped lang="scss">
.title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
}

.requests-list {
  .list-item {
    font-size: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #e7e8ea;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;

    .item-info-box {
      max-width: 80%;
    }

    .item {
      display: flex;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .item-title {
        min-width: 142px;
      }

      .item-info {
        display: inline-block;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .view-all {
      font-size: 14px;
      color: #5d80de;
      min-width: 102px;

      .view,
      .delete {
        display: inline-block;
        cursor: pointer;

        &:hover {
          color: #5d80de;
        }
      }

      .delete {
        margin-left: 12px;
      }
    }
  }
}

.requests-header {
  margin-top: 24px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;

  .ant-btn {
    height: 42px;
    border-radius: 8px;
  }

  .add-btn {
    cursor: pointer;

    &:hover {
      color: #a0b7f7;
    }
  }
}


:deep(.ant-form-item-label>label) {
  width: 124px;
}

.btn-box {
  text-align: center;

  .ant-btn {
    width: 132px;
  }
}
</style>
