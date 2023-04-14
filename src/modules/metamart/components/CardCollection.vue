<template>
  <div class="card-collection">
    <el-card :body-style="{ padding: '0px', height: '378px' }" class="box-card">
      <img :src="data.image" class="background-card" />
      <div class="card-content">
        <div class="avatar">
          <img src="https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416__480.png" alt="avatar" class="avatar-img" />
          <span class="status-icon be-flex jc-space-center align-center">
            <base-icon icon="icon-status1" size="25" />
          </span>
          <span class="badge-icon">
            <base-icon icon="icon-verified" size="20" />
          </span>
        </div>
        <div class="card-detail">
          <div class="card-detail__name">
            <div class="name text-overflow-1">{{ data.name }}</div>
            <div class="powered-by be-flex jc-space-center align-center">
              by
              <span class="creator text-hyperlink">HubbuH</span>
              <span class="asterisk-verified-icon">
                <base-icon icon="badge-verified1" size="12" />
                <span class="tick-verified-icon">
                  <base-icon icon="tick-verified1" size="6" />
                </span>
              </span>
            </div>
          </div>
          <p class="card-detail__description text-overflow-3">
            {{ data.description }}
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { object } from '@amcharts/amcharts4/core'
  import BaseIcon from '@/components/base/icon/BaseIcon.vue'
  @Component({
    components: { BaseIcon }
  })
  export default class CardCollection extends Vue {
    @Prop({ required: true, type: Object }) data!: Record<string, any>
  }
</script>

<style scoped lang="scss">
  .box-card {
    position: relative;
    width: 261px;
    max-height: 378px;
    left: 0;
    top: 0;
    border: 1px solid var(--bc-tab-buy-border);

    background: var(--bc-color-white);
    border-radius: 8px;
    .background-card {
      width: 261px;
      height: 174px;
      object-fit: cover;
    }
    .card-content {
      position: relative;
      padding: 24px 12px;
      .avatar {
        //position: relative;
        .avatar-img {
          position: absolute;
          width: 64px;
          height: 64px;
          top: 0%;
          left: 50%;
          transform: translate(-50%, -50%);

          border: 2px solid #ffffff;
          border-radius: 50%;
          object-fit: cover;
          align-items: center;

          filter: drop-shadow(0px 0.6px 1.8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 3.2px 7.2px rgba(0, 0, 0, 0.13));
        }

        .status-icon {
          position: absolute;
          top: -20px;
          right: 0%;
          left: 155px;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
        }
        .badge-icon {
          position: absolute;
          right: 0%;
          left: 60%;
          width: 21px;
          transform: translate(-50%, -50%);
        }
      }
      .card-detail {
        display: flex;
        flex-direction: column;
        text-align: center;
        margin: 16px 0 0 0;
        &__name {
          .name {
            position: static;
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
            color: var(--bc-text-primary);
            margin-bottom: 4px;
          }
          .powered-by {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            color: var(--bc-text-discript);
            .creator {
              padding-left: 4px;
            }
            .asterisk-verified-icon {
              position: relative;
              margin: 0 0 0 4px;
              .tick-verified-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -55%);
              }
            }
          }
        }
        &__description {
          margin-top: 16px;
          color: var(--bc-text-discript);
          line-height: 24px;
        }
      }
    }
  }
</style>
