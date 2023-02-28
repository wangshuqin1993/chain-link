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
      <a-table :columns="fundsColumns" :dataSource="fundsDataSource" :pagination="false"></a-table>
    </div>

    <div class="subscription-consumers" v-if="consumerDataSource.length <= 0">
      <div class="title">No consumers</div>
      <div class="desc">Your subscription is ready. You can now add consumers.</div>
      <a-button class="add-btn" @click="addConsumers">Add consumers</a-button>
    </div>
    <div class="subscription-consumer-list" v-if="consumerDataSource.length > 0">
      <div class="consumer-title">
        <div class="title">Consumers</div>
        <a-button @click="addConsumers">Add consumer</a-button>
      </div>
      <a-table :columns="consumersColumns" :dataSource="consumerDataSource" :pagination="false"></a-table>
    </div>
  </div>

  <a-modal v-model:visible="addFundsVisible" title="Add Funds" :footer="null">
    <div class="add-funds-box">
      <div class="title">Add funds (LINK)</div>
      <div class="add-funds-input">
        <a-input></a-input>
      </div>
      <div class="desc">Your wallet balance: 0.0 LINK</div>
      <div class="btn-box">
        <a-button class="confirm-btn">Confirm</a-button>
        <a-button class="cancel-btn" @click="cancelAddFunds">Cancel</a-button>
      </div>

    </div>
  </a-modal>

  <a-modal v-model:visible="addConsumerVisible" title="Add consumer" :footer="null">
    <div class="add-consumer-box">
      <div class="">Add funds (LINK)</div>
      <div class="add-funds-input">
        <a-input></a-input>
      </div>
      <div class="desc">Your wallet balance: 0.0 LINK</div>
      <div class="btn-box">
        <a-button class="confirm-btn">Confirm</a-button>
        <a-button class="cancel-btn" @click="cancelAddFunds">Cancel</a-button>
      </div>

    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
const fundsDataSource = ref([{ id: '1112', createdTime: '2023-02-27', consumers: 0, balance: '0 Link' }]);
const consumerDataSource = ref([]);
const addFundsVisible = ref(false);
const addConsumerVisible = ref(false);
const fundsColumns = [
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
    dataIndex: 'consumers',
    align: "center",
    key: 'consumers',
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
    title: 'Last Fulfillment',
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
  addFundsVisible.value = true;
}

const cancelAddFunds = () => {
}

const addConsumers = () => {
  addConsumerVisible.value = true
}

const cancelAddConsumers = () => {
}

</script>

<style scoped lang="scss">
.subscription-detail {
  max-width: 1920px;
  margin: 32px;
  text-align: left;
  color: #1a2b6b;

  .funds-title,
  .consumer-title {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 24px;
      font-weight: 700;
    }

    .ant-btn {
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