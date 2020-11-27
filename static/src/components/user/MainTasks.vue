<template>
  <div>
    <van-tabs v-model="active" animated>
      <van-tab title="Ongoing">没有做完的作业</van-tab>
      <van-tab title="Done">已经做完的作业</van-tab>
      <van-tab title="Overdue">超期的作业</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "User_Main_Tasks",
  data() {
    return {
      active: 0,
    };
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
