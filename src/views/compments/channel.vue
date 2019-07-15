<template>
  <!--
    v-model 是：
      v-bind:value="数据"
      v-on:input="数据 = $event"
    lazy-render 关闭懒加载
  -->
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      get-container="body"
      :style="{ height: '95%' }"
    >
      <!-- 我的频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button
              type="danger"
              plain
              size="mini"
              @click="isEdit = !isEdit"
              >{{ isEdit ? "完成" : "编辑" }}</van-button
            >
          </div>
        </div>
        <van-grid :gutter="10" class="channel-content" clickable>
          <van-grid-item
            v-for="(item, index) in userChannel"
            :key="item.id"
            @click="handleUserChannelClick(item, index)"
          >
            <span
              class="text"
              :class="{ active: index === activeIndex && !isEdit }"
              >{{ item.name }}</span
            >
            <van-icon class="close-icon" v-show="isEdit" name="close" />
          </van-grid-item>
        </van-grid>
      </div>
      <!-- /我的频道 -->

      <!-- 推荐频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item
            v-for="item in getrepetition"
            @click="addUserChannel(item)"
            :key="item.id"
            icon="photo-o"
          >
            <span>{{ item.name }}</span>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- /推荐频道 -->
    </van-popup>
  </div>
</template>

<script>
import {
  getAllChannels,
  updateUserChannel,
  deleteUserChannel
} from "@/api/channel";
export default {
  name: "HomeChannel",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannel: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false
    };
  },

  computed: {
    /**
     * 该计算属性用于处理获取推荐数据（也就是不包含用户频道列表的其它所有频道列表）
     * 计算属性其实也拥有 watch 的功能，但它的作用是用于当数据改变之后重新计算返回一些数据供我们使用
     */
    getrepetition() {
      const repetition = this.userChannel.map(item => item.id);
      return this.allChannels.filter(item => !repetition.includes(item.id));
    }
  },
  created() {
    this.GetAllChannels();
  },
  methods: {
    async handleUserChannelClick(item, index) {
      if (!this.isEdit) {
        this.$emit("update:active-index", index);
        this.$emit("input", false);
        return;
      }
      const channels = this.userChannel.slice(0);
      channels.splice(index, 1);
      this.$emit("update:user-channel", channels);
      const { user } = this.$store.state;
      if (user) {
        await deleteUserChannel(item.id);
        return;
      }
      window.localStorage.setItem("channels", JSON.stringify(channels));
    },
    async GetAllChannels() {
      try {
        const res = await getAllChannels();
        res.data.data.channels.forEach(item => {
          item.articles = []; // 频道的文章
          item.timestamp = Date.now(); // 用于下一页频道数据的时间戳
          item.finished = false; // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false; // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false; // 控制频道列表的下拉刷新状态
          item.pullSuccessText = ""; // 控制频道列表的下拉刷新成功提示文字
        });

        this.allChannels = res.data.data.channels;
      } catch (error) {
        window.console.log(error);
      }
    },
    // 点击添加频道
    async addUserChannel(item) {
      const channels = this.userChannel.slice(0);
      channels.push(item);
      this.$emit("update:user-channel", channels);
      const { user } = this.$store.state;
      if (user) {
        await updateUserChannel([
          {
            id: item.id,
            seq: channels.length - 1 // 序号
          }
        ]);
      } else {
        window.localStorage.setItem("channels", JSON.stringify(channels));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {
    }
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
