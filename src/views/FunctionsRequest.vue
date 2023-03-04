<template>
  <div class="functions-request-view">
    <a-button class="create-btn" @click="createRequest('1')">Create FunctionsRequest</a-button>
    <a-table :columns="columns" :dataSource="requestDataList" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="editRequest(record)">Edit</a>
          <a-divider type="vertical" />
          <a @click="deleteRequest(record)">Delete</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ChainLinkDBApi } from "@/db/chainlinkDB"
const router = useRouter();
const chainLinkDBApi = new ChainLinkDBApi();
const requestDataList = ref([]);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    align: "center",
    key: 'name',
  },
  {
    title: 'Created',
    dataIndex: 'addTime',
    align: "center",
    key: 'addTime',
  },

  {
    title: 'Action',
    dataIndex: 'action',
    align: "center",
    key: 'action',
  },
]

const createRequest = (val: string) => {
  localStorage.removeItem('requestsListData');
  router.push(`/create-request/${val}/0`)
}

const editRequest = (val: any) => {
  router.push(`/create-request/2/${val.id}`)
}

const deleteRequest = (val: any) => {
  chainLinkDBApi.deleteRequestById(val.id).then(res => {
    getRequestList()
  })
}

const getRequestList = () => {
  chainLinkDBApi.getAllRequests().then(res => {
    requestDataList.value = res
  })
}

onMounted(async () => {
  await chainLinkDBApi.open()
  getRequestList()
})

</script>

<style scoped lang="scss">
.functions-request-view {
  max-width: 1440px;
  margin: 32px;
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