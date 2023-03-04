<template>
  <div class="requestConfig">
    <a-form ref="formRef" :model="requestConfigForm">
      <a-form-item name="secretsLocation" label="secretsLocation" :rules="[{ required: true }]">
        <a-select v-model:value="requestConfigForm.secretsLocation" :options="secretsLocationList" @change="submitForm" />
      </a-form-item>

      <a-space v-for="(secretItem, index) in requestConfigForm.secrets" :key="secretItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline" v-if="requestConfigForm.secretsLocation === '0'">
        <a-form-item :name="['secrets', index, 'key']" :label="index === 0 ? 'secrets' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="secretItem.key" @blur="submitForm" autocomplete="off" />
        </a-form-item>
        <a-form-item label="" :name="['secrets', index, 'value']" :rules="{
          required: false,
        }">
          <a-input v-model:value="secretItem.value" @blur="submitForm" autocomplete="off" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addSecret" />
        <MinusCircleOutlined v-if="index > 0" @click="removeSecret(secretItem)" />
      </a-space>


      <a-form-item name="secretsURL" label="secretsURL" v-if="requestConfigForm.secretsLocation === '1'"
        :rules="{ required: false }">
        <a-input v-model:value="requestConfigForm.secretsURL" placeholder="please input secretsURL" autocomplete="off"
          @blur="submitForm"></a-input>
      </a-form-item>


      <a-space v-for="(argItem, index) in requestConfigForm.args" :key="argItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline">
        <a-form-item :name="['args', index, 'key']" :label="index === 0 ? 'args' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="argItem.key" autocomplete="off" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addArg" />
        <MinusCircleOutlined v-if="index > 0" @click="removeArg(argItem)" />
      </a-space>
    </a-form>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance } from 'ant-design-vue';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
const formRef = ref<FormInstance>();
const requestConfigForm = reactive({
  secretsLocation: '',
  secrets: [{ key: '', value: '', id: Date.now() }],
  args: [{ key: '', value: '', id: Date.now() }],
  secretsURL: '',
});
const secretsLocationList = ref([{ label: 'Inline', value: '0' }, { label: 'Remote', value: '1' }]);

const props = defineProps({
  requestConfigData: Object,
})

const emit = defineEmits(["submitRequestConfigForm"]);


const addSecret = () => {
  requestConfigForm.secrets.push({
    key: undefined,
    value: undefined,
    id: Date.now()
  });
}

const removeSecret = (item: any) => {
  let index = requestConfigForm.secrets.indexOf(item);
  if (index !== -1) {
    requestConfigForm.secrets.splice(index, 1);
  }
}

const addArg = () => {
  requestConfigForm.args.push({
    key: undefined,
    id: Date.now()
  });
}

const removeArg = (item: any) => {
  let index = requestConfigForm.args.indexOf(item);
  if (index !== -1) {
    requestConfigForm.args.splice(index, 1);
  }
}

const submitForm = () => {
  console.log("requestConfig", requestConfigForm)
  formRef.value
    .validate()
    .then(() => {
      // console.log("requestConfig123", requestConfigForm)
      emit('submitRequestConfigForm', requestConfigForm)
    })
    .catch(error => {
      console.log('error', error);
    });
}

watch(() => props.requestConfigData,
  (val) => {
    if (val) {
      Object.assign(requestConfigForm, val)
    }
  }, {
  deep: true,
  immediate: true
})


defineExpose({ submitForm });
</script>
<style lang='scss' scoped>
.requestConfig-title {
  padding-bottom: 8px;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  color: #1a2b6b;
  border-bottom: 1px solid #e7e8ea;
}

:deep(.ant-form-item-label>label) {
  width: 124px;
}

:deep(.ant-select-selection-item) {
  line-height: 40px !important;
}
</style>