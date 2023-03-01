<template>
  <div class="functions">
    <div>Functions</div>
    <a-textarea v-model:value="functionValue" :rows="4" placeholder="please enter..." @pressEnter="getFunctionData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const functionValue = ref<string>('');
const emit = defineEmits(["getFunctionData"]);

const getFunctionData = (val: any) => {

  console.log(functionValue.value, 'val')
  emit('getFunctionData', functionValue.value)
}

</script>

<style lang="scss" scoped>
.functions {}
</style>