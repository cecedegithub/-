<template>
  <div>
    <van-nav-bar class="dl" title="首页" />
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
      <van-tab
        v-for="channelItem in channels"
        :key="channelItem.id"
        :title="channelItem.name"
      >
        <!--
          下拉刷新组件
          isLoading 控制下拉的 loading 状态
          refresh 下拉之后触发的事件
        -->
        <van-pull-refresh
          v-model="channelItem.pullRefreshLoading"
          @refresh="onRefresh"
          :success-text="channelItem.pullSuccessText"
          :success-duration="1000"
        >
          <!--
            loading 控制加载更多的 loading 状态
            finished 控制是否已加载结束
            onLoad 事件会在滚动到底部区域的时候自动调用，每次 onLoad 它会自动让 loading 为 true
          -->
          <van-list
            v-model="channelItem.upLoading"
            :finished="channelItem.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!--
              列表中的内容
            -->
            <van-cell
              v-for="item in channelItem.articles"
              :key="item.art_id"
              :title="item.title"
            />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-tabbar>
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { getchannels } from "@/api/channel";
import { getArticles } from "@/api/article";
export default {
  name: "home",
  data() {
    return {
      channels: [],
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false
    };
  },
  created() {
    this.loadInformation();
  },
  computed: {
    activeChannel() {
      return this.channels[this.activeChannelIndex];
    }
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      await this.$sleep(800);
      const res = await this.loadArticles();
      this.activeChannel.articles.push(...res.results);
      this.activeChannel.upLoading = false;
    },
    async loadInformation() {
      try {
        let channels = [];
        // 这行代码有什么意义?从哪里获取到的值存起来的?
        const localchannel = window.localStorage.getItem("channels");
        if (localchannel) {
          channels = localchannel;
        } else {
          const res = await getchannels();
          channels = res.data.data.channels;
        }
        channels.forEach(item => {
          item.articles = []; // 频道的文章
          item.timestamp = Date.now(); // 用于下一页频道数据的时间戳
          item.finished = false; // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false; // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false; // 控制频道列表的下拉刷新状态
          item.pullSuccessText = ""; // 控制频道列表的下拉刷新成功提示文字
        });
        this.channels = channels;
      } catch (error) {
        window.console.log(error);
      }
    },
    async onRefresh() {
      const res = await getArticles({
        channelId: this.activeChannel.id,
        timestamp: Date.now(),
        withTop: 1
      });
      const results = res.data.data.results;
      if (results.length) {
        this.activeChannel.articles = results;
        this.activeChannel.pre_timestamp = res.data.data.pre_timestamp;
        this.activeChannel.pullSuccessText = "更新完成";
        this.onLoad();
      } else {
        this.activeChannel.pullSuccessText = "暂时没有可更新数据";
      }
      this.activeChannel.pullRefreshLoading = false;
    },
    // 公用请求加载数据列表
    async loadArticles() {
      // const user = this.$store.state.user;

      const { id: channelId, timestamp } = this.activeChannel;
      try {
        const res = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        });
        const newdata = res.data.data;
        const pre_timestamp = res.data.data.pre_timestamp;
        if (newdata.results.length === 0 && pre_timestamp) {
          this.activeChannel.timestamp = pre_timestamp;
          return this.loadArticles();
        }
        if (newdata.results.length) {
          this.activeChannel.timestamp = pre_timestamp;
          return newdata;
        }
      } catch (error) {
        window.console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.dl {
  background-color: aquamarine;
}
</style>
