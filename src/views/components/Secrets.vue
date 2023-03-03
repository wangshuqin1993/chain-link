<template>
  <div class="secrets">
    <a-form ref="formRef" :model="secretsForm">
      <a-form-item name="secretsName" label="secretsName" :rules="[{ required: true }]">
        <a-input v-model:value="secretsForm.secretsName" placeholder="please input secretsName"
          @blur="submitForm"></a-input>
      </a-form-item>

      <a-form-item name="secretsLocation" label="secretsLocation" :rules="[{ required: true }]">
        <a-select v-model:value="secretsForm.secretsLocation" :options="secretsLocationList" @change="submitForm" />
      </a-form-item>

      <a-space v-for="(secretItem, index) in secretsForm.secrets" :key="secretItem.id"
        style="display: flex; margin-bottom: 8px" align="baseline" v-if="secretsForm.secretsLocation === 'Inline'">
        <a-form-item :name="['secrets', index, 'key']" :label="index === 0 ? 'secrets' : ' '" :rules="{ required: true }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="secretItem.key" @blur="submitForm" />
        </a-form-item>
        <a-form-item label="" :name="['secrets', index, 'value']" :rules="{
          required: true,
        }">
          <a-input v-model:value="secretItem.value" @blur="submitForm" />
        </a-form-item>
        <PlusCircleOutlined v-if="index == 0" @click="addSecret" />
        <MinusCircleOutlined v-if="index > 0" @click="removeSecret(secretItem)" />
      </a-space>


      <a-form-item name="secretsURL" label="secretsURL" v-if="secretsForm.secretsLocation === 'Remote'"
        :rules="{ required: true }">
        <a-input v-model:value="secretsForm.secretsURL" placeholder="please input secretsURL"
          @blur="submitForm"></a-input>
      </a-form-item>


      <a-space v-for="(argItem, index) in secretsForm.args" :key="argItem.id" style="display: flex; margin-bottom: 8px"
        align="baseline">
        <a-form-item :name="['args', index, 'key']" :label="index === 0 ? 'args' : ' '" :rules="{ required: false }"
          :colon="index === 0 ? true : false">
          <a-input v-model:value="argItem.key" />
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
const secretsForm = reactive({
  secretsName: '',
  secretsLocation: '',
  secrets: [{ key: '', value: '', id: Date.now() }],
  args: [{ key: '', value: '', id: Date.now() }],
  secretsURL: '',
});
const secretsLocationList = ref([{ label: 'Remote', value: 'Remote' }, { label: 'Inline', value: 'Inline' }]);

const props = defineProps({
  sceretsData: Object,
})

const emit = defineEmits(["submitSecretsForm"]);


const addSecret = () => {
  secretsForm.secrets.push({
    key: undefined,
    value: undefined,
    id: Date.now()
  });
}

const removeSecret = (item: any) => {
  let index = secretsForm.secrets.indexOf(item);
  if (index !== -1) {
    secretsForm.secrets.splice(index, 1);
  }
}

const addArg = () => {
  secretsForm.args.push({
    key: undefined,
    id: Date.now()
  });
}

const removeArg = (item: any) => {
  let index = secretsForm.args.indexOf(item);
  if (index !== -1) {
    secretsForm.args.splice(index, 1);
  }
}

const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      // console.log(addReturnForm, '99')
      emit('submitSecretsForm', secretsForm)
    })
    .catch(error => {
      console.log('error', error);
    });
}

watch(() => props.sceretsData,
  (val) => {
    if (val) {
      Object.assign(secretsForm, val)
      // functionValue.value = val;
    }
  }, {
  deep: true,
  immediate: true
})


defineExpose({ submitForm });
</script>
<style lang='scss' scoped>
.secrets-title {
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