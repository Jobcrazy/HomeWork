<template>
  <div>
    <keep-alive> <router-view /> </keep-alive>
    <van-tabbar
      v-model="active"
    >
      <van-tabbar-item icon="records" replace to="/user/main/tasks">
        Tasks
      </van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" replace to="/user/main/courses"
        >Courses
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" replace to="/user/main/me"
        ><span>Me</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "User_Main",
  data() {
    return {
      active: 0,
    };
  },
  mounted() {
    switch (this.$route.path) {
      case "/user/main/courses":
        this.active = 1;
        break;
      case "/user/main/me":
        this.active = 2;
        break;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
