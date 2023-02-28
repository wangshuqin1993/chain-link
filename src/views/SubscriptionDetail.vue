<template>
  <div class="subscription-detail">
    <a-breadcrumb>
      <a-breadcrumb-item><a href="/">Subscription</a></a-breadcrumb-item>
      <a-breadcrumb-item>Subscription Detail</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="subscription-funds">
      <div class="funds-title">
        <div class="title">Subscription</div>
        <a-button>Add Funds</a-button>
      </div>

    </div>
    <div class="subscription-consumers">
      <div class="title">No consumers</div>
      <div class="desc">Your subscription is ready. You can now add consumers.</div>
      <a-button>Add consumers</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.subscription-detail {
  max-width: 1920px;
  margin: 32px;
  text-align: left;
  color: #1a2b6b;

  .subscription-funds {
    margin-top: 32px;
    width: 100%;

    .funds-title {
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
  }

  .subscription-consumers {
    padding: 24px 0;
    text-align: center;
    width: 100%;
    border: 1px solid #e7e8ea;
    border-radius: 8px;

    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .desc {
      color: #555c6c;
      padding: 12px 0;
    }

    .ant-btn {
      font-weight: 700;
      width: 132px;
      height: 42px;
      border-color: #375bd2;
      border-width: 2px;
      color: #375bd2;
      border-radius: 8px;
    }
  }
}
</style>