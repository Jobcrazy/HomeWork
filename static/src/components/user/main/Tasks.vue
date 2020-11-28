<template>
  <div>
    <van-tabs v-model="active" animated @click="onClickTab">
      <van-tab title="Ongoing">
        <van-row style="margin-bottom: 15px" />
        <van-row v-for="task in ongoing_tasks" :key="task.id">
          <task_item :task="task" />
        </van-row>
      </van-tab>
      <van-tab title="Done">
        <van-row style="margin-bottom: 15px" />
        <van-row v-for="task in done_tasks" :key="task.id">
          <task_item :task="task" />
        </van-row>
      </van-tab>
      <van-tab title="Overdue">
        <van-row style="margin-bottom: 15px" />
        <van-row v-for="task in overdue_tasks" :key="task.id">
          <task_item :task="task" />
        </van-row>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Task_Item from "./TaskItem";
export default {
  name: "User_Main_Tasks",
  components: {
    task_item: Task_Item,
  },
  data() {
    return {
      active: 0,
      ongoing_tasks: [],
      done_tasks: [],
      overdue_tasks: [],
    };
  },
  methods: {
    onClickTab(name, title) {
      this.loadData(name)
    },
    loadData(type) {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      let url = "/homework/ongoing";
      if (1 == type) {
        url = "/homework/finished";
      } else if (2 == type) {
        url = "/homework/overdue";
      }

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url,
        data: { uid: self.$store.state.uid, token: self.$store.state.token },
      })
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res.data);
            return self.$toast.fail(res.data.message);
          }

          if (0 == type) {
            self.ongoing_tasks = res.data.data;
          } else if (1 == type) {
            self.done_tasks = res.data.data;
          } else if (2 == type) {
            self.overdue_tasks = res.data.data;
          }
          self.$toast.clear();
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
  },
  mounted() {
    this.loadData(0);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
