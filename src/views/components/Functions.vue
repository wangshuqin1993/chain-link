<template>
  <div class="functions">
    <div class="title">Define Calculation Method</div>
    <a-textarea v-model:value="functionValue" :rows="4" :autosize="true" placeholder="please enter..."
      @blur="getFunctionData" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  functionData: String,
});

console.log(props.functionData, 'props')

const functionValue = ref<string>('');


const emit = defineEmits(["getFunctionData"]);

const getFunctionData = (val: any) => {

  console.log(functionValue.value, 'val')
  emit('getFunctionData', functionValue.value)
}

watch(() => props.functionData,
  (val) => {
    if (val) {
      functionValue.value = val;
      emit('getFunctionData', functionValue.value)
    }
  }, {
  deep: true,
  immediate: true
})

</script>

<style lang="scss" scoped>
.functions {
  margin-bottom: 32px;

  .title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 12px;
  }
}
</style>