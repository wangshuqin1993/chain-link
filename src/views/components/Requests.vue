<template>
  <div class="requests-list" v-if="requestsList.length > 0">
    <div v-for="item in requestsList" :key="item.id" class="list-item">
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
      <div class="item item-method">
        <span class="item-title">Method: </span>
        <span class="item-info">{{ item.formData.Method }}</span>
      </div>
      <div>
        <span>View more</span>

        <span>Edit</span>
      </div>
    </div>
  </div>
  <div class="requests">
    <div class="requests-header">
      <a-button type="dashed" style="width: 60%" @click="addRequestsVisible = true">
        <PlusOutlined />
        Add Request
      </a-button>
    </div>
  </div>
  <a-modal v-model:visible="addRequestsVisible" title="Add Request" :footer="null">
    <a-form ref="formRef" :model="addRequestsForm">
      <a-form-item name="requestName" label="requestName" :rules="[{ required: true, message: 'Missing requestName' }]">
        <a-input v-model:value="addRequestsForm.requestName" placeholder="please input requestName"></a-input>
      </a-form-item>

      <a-form-item name="responseName" label="responseName"
        :rules="[{ required: true, message: 'Missing responseName' }]">
        <a-input v-model:value="addRequestsForm.responseName" placeholder="please input responseName"></a-input>
      </a-form-item>

      <a-form-item name="URL" label="URL" :rules="[{ required: true, message: 'Missing URL' }]">
        <a-input v-model:value="addRequestsForm.URL" placeholder="please input URL"></a-input>
      </a-form-item>

      <a-form-item name="method" label="Method" :rules="[{ required: false }]">
        <a-select v-model:value="addRequestsForm.method" :options="methodsList" />
      </a-form-item>

      <a-space v-for="(headerItem, index) in addRequestsForm.headers" :key="headerItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['headers', index, 'key']" :label="index === 0 ? 'Headers' : ''" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="headerItem.key" />
        </a-form-item>
        <a-form-item label="" :name="['headers', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="headerItem.value" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addHeader" />
        <MinusCircleOutlined v-if="index > 0" @click="removeHeader(headerItem)" />
      </a-space>


      <a-space v-for="(paramItem, index) in addRequestsForm.params" :key="paramItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['params', index, 'key']" :label="index === 0 ? 'params' : ''" :rules="{ required: false }">
          <a-input v-model:value="paramItem.key" />
        </a-form-item>
        <a-form-item label="" :name="['params', index, 'name']" :rules="{
          required: false,
        }">
          <a-input v-model:value="paramItem.name" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addHeader" />
        <MinusCircleOutlined v-if="index > 0" @click="removeHeader(paramItem)" />
      </a-space>

      <a-space v-for="(dataItem, index) in addRequestsForm.data" :key="dataItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['data', index, 'key']" :label="index === 0 ? 'data' : ''" :rules="{ required: false }">
          <a-input v-model:value="dataItem.key" />
        </a-form-item>
        <a-form-item label="" :name="['data', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="dataItem.value" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addHeader" />
        <MinusCircleOutlined v-if="index > 0" @click="removeHeader(dataItem)" />
      </a-space>



      <a-form-item name="timeout" label="timeout" :rules="[{ required: false }]">
        <a-input v-model:value="addRequestsForm.timeout" placeholder="please input timeout"></a-input>
      </a-form-item>

      <a-form-item name="responseType" label="responseType" :rules="[{ required: false }]">
        <a-input v-model:value="addRequestsForm.responseType" placeholder="please input responseType"></a-input>
      </a-form-item>

      <a-form-item class="btn-box">
        <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance } from 'ant-design-vue';
import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { date } from "joi";
const formRef = ref<FormInstance>();
const addRequestsForm = reactive({
  requestName: '',
  responseName: '',
  URL: '',
  method: '',
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
// const requestsList = ref([]);
const requestsList = JSON.parse(localStorage.getItem('requestsListData'));

interface Sights {
  value: string;
  price: string;
  id: number;
};

const emit = defineEmits(["submitRequestForm"])

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
  });
};


const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      requestsList.value.push({ id: Date.now(), formData: addRequestsForm });
      localStorage.setItem('requestsListData', JSON.stringify(requestsList.value));
      console.log(requestsList.value, 'values', addRequestsForm);
      emit('submitRequestForm', addRequestsForm)

    })
    .catch(error => {
      console.log('error', error);
    });
};

const resetForm = () => {
  formRef.value.resetFields();
};

</script>

<style scoped lang="scss">
.requests-list {
  font-size: 16px;

  .list-item {
    padding: 24px;
    border: 1px solid #e7e8ea;
    border-radius: 8px;

    .item {
      display: flex;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .item-title {
        width: 50%;
      }
    }
  }
}

.requests {
  font-size: 16px;
  border-radius: 8px;

  .requests-header {
    display: flex;
    justify-content: space-between;

    .ant-btn {
      height: 42px;
      border-radius: 8px;
    }

    .add-btn {
      cursor: pointer;

      &:hover {
        color: #5d80de;
      }


    }
  }
}

:deep(.ant-form-item-label>label) {
  width: 124px;
}

:deep(.ant-space-item) {
  // margin-top: -24px;
}

.btn-box {
  text-align: center;

  .ant-btn {
    width: 132px;
  }
}
</style>
