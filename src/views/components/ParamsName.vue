<template>
  <div class="params-name">
    <a-form ref="formRef" name="dynamic_form_item" :model="dynamicValidateForm">
      <div class="title">Define Param Name</div>
      <a-form-item v-for="(paramsName, index) in dynamicValidateForm.paramsNames" :key="paramsName"
        :name="['paramsNames', index, 'value']" :rules="{
          required: false,
        }">
        <a-input v-model:value="paramsName.value" placeholder="please input paramsName" @pressEnter="submitForm"
          autocomplete="off" style="width: 94%; margin-right: 8px" @blur="onFieldBlur(index)" />
        <MinusCircleOutlined class="dynamic-delete-button" :disabled="dynamicValidateForm.paramsNames.length === 1"
          @click="removeparamsName(paramsName)" />
      </a-form-item>
      <a-form-item>
        <a-button type="dashed" style="width: 100%" @click="addparamsName">
          <PlusOutlined />
          Add New Parameter
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';

interface paramsName {
  value: string;
  // key: number;
}

const props = defineProps({
  paramsData: Array,
})

const emit = defineEmits(["submitParamsForm"])

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{ paramsNames: paramsName[] }>({
  paramsNames: [],
});

const onFieldBlur = (index: number) => {
  console.log(index, 'blur')
  console.log('values', dynamicValidateForm.paramsNames);
  emit('submitParamsForm', dynamicValidateForm.paramsNames)
}


const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      // console.log('values', dynamicValidateForm.paramsNames);
      emit('submitParamsForm', dynamicValidateForm.paramsNames)
    })
    .catch(error => {
      console.log('error', error);
    });
};

const removeparamsName = (item: paramsName) => {
  let index = dynamicValidateForm.paramsNames.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.paramsNames.splice(index, 1);
  }
};

const addparamsName = () => {
  dynamicValidateForm.paramsNames.push({
    value: '',
  });
};

watch(() => props.paramsData,
  (val) => {
    if (val) {
      dynamicValidateForm.paramsNames = val;
      emit('submitParamsForm', dynamicValidateForm.paramsNames)
    }
  }, {
  deep: true, // 监视对象内部属性的变化
  immediate: true
}
)


</script>

<style scoped lang="scss">
.params-name {
  .title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 12px;
  }

  .ant-input {
    height: 42px;
    border-radius: 8px;
  }

  .ant-btn {
    height: 42px;
    border-radius: 8px;
  }
}
</style>