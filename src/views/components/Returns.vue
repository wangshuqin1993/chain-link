<template>
  <div class="return">
    <div class="title">Define Return</div>
    <div>
      <a-form ref="formRef" :model="addReturnForm">
        <a-form-item name="returnType" label="returnType" :rules="[{ required: true }]">
          <a-select v-model:value="addReturnForm.returnType" :options="returnTypeList" @change="submitForm" />
        </a-form-item>
        <a-form-item name="returnParam" label="returnParam" :rules="[{ required: true }]">
          <a-input v-model:value="addReturnForm.returnParam" placeholder="please input returnParam"
            @blur="submitForm"></a-input>
        </a-form-item>

        <!-- <a-form-item class="btn-box">
          <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item> -->
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { FormInstance } from 'ant-design-vue';
const formRef = ref<FormInstance>();
const returnTypeList = ref([{ label: 'Functions.encodeUint256', value: 'Functions.encodeUint256' }, { label: 'Functions.encodeInt256', value: 'Functions.encodeInt256' }, { label: 'Functions.encodeString', value: 'Functions.encodeString' }])
const addReturnForm = reactive({
  returnType: '',
  returnParam: '',
});
const emit = defineEmits(["submitReturnForm"]);


const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      // console.log(addReturnForm, '99')
      emit('submitReturnForm', addReturnForm)
    })
    .catch(error => {
      console.log('error', error);
    });
}

const resetForm = () => {
  formRef.value.resetFields();
};

defineExpose({ submitForm });
</script>
<style lang='scss' scoped>
.return {
  .title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 12px;
  }

  .btn-box {
    text-align: center;

    .ant-btn {
      width: 132px;
    }
  }
}

:deep(.ant-form-item-label>label) {
  width: 124px;
}
</style>