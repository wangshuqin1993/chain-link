<template>
  <div class="subscription-detail">
    <a-breadcrumb>
      <a-breadcrumb-item><a href="/">Subscription</a></a-breadcrumb-item>
      <a-breadcrumb-item>Subscription Detail</a-breadcrumb-item>
    </a-breadcrumb>

    <div class="subscription-funds">
      <div class="funds-title">
        <div class="title">Subscription</div>
        <a-button @click="showAddFunds">Add Funds</a-button>
      </div>
      <a-table :columns="fundsColumns" :dataSource="subscriptionDetailData" :pagination="false">
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'balance'">
            <div>
              {{ text + ' Link' }}
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <div class="subscription-consumers" v-if="consumersList.length <= 0">
      <div class="title">No consumers</div>
      <div class="desc">Your subscription is ready. You can now add consumers.</div>
      <a-button class="add-btn" @click="addConsumer">Add consumer</a-button>
    </div>
    <div class="subscription-consumer-list" v-if="consumersList.length > 0">
      <div class="consumer-title">
        <div class="title">Consumers</div>
        <a-button @click="addConsumer">Add consumer</a-button>
      </div>
      <a-table :columns="consumersColumns" :dataSource="consumersList" :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'action'">
            <span>
              <a @click="deleteConsumer(record)">Delete</a>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <a-modal v-model:visible="addFundsVisible" title="Add Funds" :footer="null">
    <div class="add-funds-box">
      <div class="title">Add funds (LINK)</div>
      <div class="add-funds-input">
        <a-input v-model:value="addFundsAmount"></a-input>
      </div>
      <div class="desc">Your wallet balance: {{ balanceOfLink }} LINK</div>
      <div class="btn-box">
        <a-button class="confirm-btn" @click="confirmAddFunds">Confirm</a-button>
        <a-button class="cancel-btn" @click="cancelAddFunds">Cancel</a-button>
      </div>

    </div>
  </a-modal>

  <a-modal v-model:visible="addConsumerVisible" title="Add consumer" :footer="null">
    <div class="add-consumer-box">
      <div class="">Add consumer</div>
      <div class="add-funds-input">
        <a-input v-model:value="addConsumerAddress"></a-input>
      </div>
      <div class="btn-box">
        <a-button class="confirm-btn" @click="confirmAddConsumer">Confirm</a-button>
        <a-button class="cancel-btn" @click="cancelAddConsumer">Cancel</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { LinkTokenApi } from "@/api/linkTokenApi";
import { RegistryApi } from "@/api/registryApi";
import { Consumer, Subscription, SubscriptionDBApi } from "@/db/subscription";
import { useOnboard } from "@web3-onboard/vue";
import { ethers } from "ethers";
import { ref, onMounted, Ref } from "vue";
import { useRoute } from "vue-router";
const { params } = useRoute();
const addFundsVisible = ref(false);
const addConsumerVisible = ref(false);
const addConsumerAddress = ref("");
const addFundsAmount = ref();
const balanceOfLink = ref("0");
const subscriptionDetailData: Ref<Subscription[]> = ref([]);
const consumersList: Ref<Consumer[]> = ref([]);
let registryApi: RegistryApi;
let linkTokenApi;
const subscriptionDBApi = new SubscriptionDBApi();
//get subcription data
subscriptionDBApi.open().then(() => {
  getSubscription(parseInt(params.id));
})

const fundsColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: "center",
    key: 'id',
  },
  {
    title: 'Admain',
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
    title: 'Consumers',
    dataIndex: 'consumerCount',
    align: "center",
    key: 'consumerCount',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    align: "center",
    key: 'balance',
  },
];

const consumersColumns = [
  {
    title: 'Address',
    dataIndex: 'address',
    align: "center",
    key: 'address',
  },
  {
    title: 'Added',
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

const showAddFunds = () => {
  const provider = useOnboard().connectedWallet.value?.provider;
  const network = useOnboard().connectedWallet.value?.chains[0].id;
  const account = useOnboard().connectedWallet.value?.accounts[0].address;
  if (provider && network && account) {
    linkTokenApi = new LinkTokenApi(provider, network);
    linkTokenApi.balanceOf(account).then(balance => {
      balanceOfLink.value = ethers.utils.formatEther(balance);
    })
  }

  addFundsVisible.value = true;
}

const cancelAddFunds = () => {
  addFundsVisible.value = false;
}

const confirmAddFunds = () => {
  const provider = useOnboard().connectedWallet.value?.provider;
  const network = useOnboard().connectedWallet.value?.chains[0].id;
  if (provider && network) {
    linkTokenApi = new LinkTokenApi(provider, network);
    registryApi = new RegistryApi(provider, network);
    let data = ethers.utils.defaultAbiCoder.encode(["uint64"], [params.id]);
    const weiValue = ethers.utils.parseEther(addFundsAmount.value.toString());
    linkTokenApi.transferAndCall(registryApi.contract.address, weiValue, data).then(receipt => {
      console.log(receipt);
      //update subscription
      registryApi.getSubscription(params.id).then(t => {
        console.log("aaa");
        subscriptionDBApi.updateSubscriptionBalance(parseInt(params.id), ethers.utils.formatEther(t.balance)).then(data => {
          if (data) {
            subscriptionDetailData.value = [];
            subscriptionDetailData.value.push(data);
          }
        })
      });
      addFundsVisible.value = false;
    })
  }
}

const addConsumer = () => {
  addConsumerVisible.value = true
}

const cancelAddConsumer = () => {
  addConsumerVisible.value = false
}

const confirmAddConsumer = () => {
  const provider = useOnboard().connectedWallet.value?.provider;
  const network = useOnboard().connectedWallet.value?.chains[0].id;
  if (provider && network) {
    registryApi = new RegistryApi(provider, network);
    registryApi.addConsumer(parseInt(params.id), addConsumerAddress.value).then(receipt => {
      console.log(receipt);
      registryApi.getSubscription(params.id).then(t => {
        subscriptionDBApi.updateSubscriptionConsumers(parseInt(params.id), t.consumers).then(data => {
          if (data) {
            consumersList.value = data.consumers;
          }
        })
      });
      addConsumerVisible.value = false;
    })
  }
}

const deleteConsumer = (val: any) => {
  console.log(val, 'val')
}



const getSubscription = (id: number) => {
  subscriptionDBApi.getSubscription(id).then(data => {
    console.log("getSubscription", id, data);
    subscriptionDetailData.value = [];
    if (data) {
      subscriptionDetailData.value.push(data);
      consumersList.value = data.consumers;
    }
  })
}



</script>

<style scoped lang="scss">
.subscription-detail {
  max-width: 1440px;
  margin: 96px 32px 32px;
  text-align: left;
  color: #1a2b6b;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;

  .funds-title,
  .consumer-title {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .ant-btn {
      margin-bottom: 16px;
      color: #ffffff;
      font-weight: 700;
      width: 132px;
      height: 42px;
      border-radius: 8px;
      border-color: #375bd2;
      background-color: #375bd2;
    }
  }

  .subscription-funds {
    margin-top: 32px;
    width: 100%;

    .add-funds-box {
      border: 1px solid #e7e8ea;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0 32px;

    }
  }

  .subscription-consumers {
    padding: 24px 0;
    text-align: center;
    width: 100%;
    border: 1px solid #e7e8ea;
    border-radius: 8px;
    margin-top: 32px;

    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .desc {
      color: #555c6c;
      padding: 12px 0;
    }

    .add-btn {
      border-color: #375bd2;
      border-width: 2px;
      color: #375bd2;
    }
  }

  .subscription-consumer-list {
    margin-top: 32px;
  }

}

.add-funds-box,
.add-consumer-box {
  .title {
    color: #1a2b6b;
  }

  .add-funds-input {
    margin: 12px 0;
  }

  .desc {
    color: #6d7380;
  }
}

.btn-box {
  text-align: center;
  margin-top: 32px;
}

.ant-btn {
  font-weight: 700;
  width: 132px;
  height: 42px;
  border-radius: 8px;
}

.confirm-btn {
  margin: 0 12px;
}

.cancel-btn {
  color: #375bd2;
  border-color: #375bd2;
}

.ant-input {
  height: 42px;
  border-radius: 8px;
}

:deep(.ant-btn[disabled]) {
  background-color: #ecedef !important;
  color: #858a95 !important;
  border-color: #ecedef !important;
}
</style>