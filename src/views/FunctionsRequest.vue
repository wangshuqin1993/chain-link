<template>
  <div class="functions-request-view">
    <a-button class="create-btn" @click="createRequest('1')">Create FunctionsRequest</a-button>
    <a-table :columns="columns" :dataSource="dataSource"></a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ChainLinkDBApi } from "@/db/chainlinkDB"
const router = useRouter();
const chainLinkDBApi = new ChainLinkDBApi();

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'owner',
    align: "center",
    key: 'owner',
  },
  {
    title: 'Created',
    dataIndex: 'createdTime',
    align: "center",
    key: 'createdTime',
  },

  {
    title: 'Action',
    dataIndex: 'balance',
    align: "center",
    key: 'balance',
  },
]

const dataSource = ref([]);

const createRequest = (val: string) => {
  router.push(`/create-request/${val}`)
}

onMounted(async () => {
  await chainLinkDBApi.open()
  chainLinkDBApi.getAllRequests().then(res => {
    console.log(res, 'getValue')
  })
})

</script>

<style scoped lang="scss">
.functions-request-view {
  max-width: 1440px;
  margin: 96px 32px 32px;
  text-align: left;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;

  .create-btn {
    margin-bottom: 32px;
  }

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