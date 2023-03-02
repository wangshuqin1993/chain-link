<template>
  <div class="functions-request-view">
    <a-button @click="createRequest('1')">Create FunctionsRequest</a-button>
    <a-table></a-table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const createRequest = (val: string) => {
  router.push(`/create-request/${val}`)
}

</script>

<style scoped lang="scss">
.functions-request-view {
  max-width: 1440px;
  margin: 32px;
  text-align: left;

  .ant-btn {
    height: 42px;
    border-color: #375bd2;
    background-color: #375bd2;
    color: #ffffff;
    border-radius: 8px;
    font-weight: 700;
  }
}
</style>