<template>
  <div class="subscription-view">
    <a-button @click="createSubscription">Create Subscription</a-button>
    <div class="subscriptions-list">
      <div class="subscriptions-title">My Subscriptions</div>
    </div>

    <a-tabs v-model:activeKey="activeKey" class="subscription-table">
      <a-tab-pane key="1" tab="Active">
        <a-table :dataSource="subscriptionList" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'id'">
              <div class="table-detail">
                <span class="point"></span>
                <a @click="toDetail(text)">{{ text }}</a>
              </div>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>

  <Wallets ref="showWallets"></Wallets>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { useRouter } from "vue-router";
import Wallets from "../components/Wallets.vue";
import dayjs from 'dayjs';
import { Subscription } from "@/db/chainlinkDB";
import { useChainlinkDB, useContractApi } from "@/stores/useStore";
const chainlinkDB = useChainlinkDB()
const contractApi = useContractApi()

const router = useRouter();
const showWallets = ref();
const activeKey = ref('1');
const subscriptionList: Ref<Subscription[]> = ref([]);
const currentsubscriptionId = ref(1)
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Created',
    dataIndex: 'createdTime',
    align: "center",
    key: 'createdTime',
  },
  {
    title: 'Consumers',
    dataIndex: 'consumerCount',
    align: "center",
    key: 'consumersCount',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: "center",
    key: 'balance',
  },
];


const searchSubscriptionByOwner = (owner: string) => {
  console.log("owner", owner)
  chainlinkDB.apiStatus && chainlinkDB.chainLinkDBApi.searchSubscriptionByOwner(owner).then(data => {
    subscriptionList.value = data;
    console.log(data, 'data')
  })
}

watch([() => chainlinkDB.networkId, () => chainlinkDB.apiStatus, () => contractApi.walletAddress],
  (newValues, oldValues) => {
    if (newValues[0] && newValues[1] && newValues[2]
      && (newValues[0] != oldValues[0]
        || newValues[2] != oldValues[2]
        || newValues[1] != oldValues[1])
    ) {
      console.log(newValues[2])
      searchSubscriptionByOwner(newValues[2])
    }
  }, {
  deep: true, // 监视对象内部属性的变化
  immediate: true
});


const createSubscription = () => {
  if (contractApi.apiStatus) {
    contractApi.registryApi?.createSubscription().then(receipt => {
      //console.log("receipt:", receipt);
      const events = contractApi.registryApi?.contract.interface.parseLog(receipt.logs[0]);
      currentsubscriptionId.value = events.args[0].toNumber();
      const subscription: Subscription = {
        id: events.args[0].toNumber(),
        createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        consumers: [],
        balance: '0',
        consumerCount: 0,
        owner: receipt.from.toLowerCase()
      };
      chainlinkDB.apiStatus && chainlinkDB.chainLinkDBApi.addSubscription(subscription);
      searchSubscriptionByOwner(receipt.from.toLowerCase());
    });
  } else {
    showWallets.value?.onClickConnect();
  }
}


const toDetail = (id: number) => {
  router.push(`/subscription-detail/${id}`)
}
</script>

<style scoped lang="scss">
.subscription-view {
  text-align: left;
  max-width: 1440px;
  margin: 96px 32px 32px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;

  .subscriptions-list {

    .subscriptions-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a2b6b;
      margin-top: 32px;
    }
  }

  .ant-btn {
    width: 184px;
    height: 42px;
    border-color: #375bd2;
    background-color: #375bd2;
    color: #ffffff;
    border-radius: 8px;
    font-weight: 700;
  }
}

.subscription-table {
  .table-detail {
    cursor: pointer;
  }

  .point {
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #ecedef;
    border-radius: 50%;
    position: relative;
    margin-right: 8px;

    &::before {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #2fb96c;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

    }
  }
}
</style>