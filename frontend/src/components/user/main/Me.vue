<template>
  <div class="content">
    <van-row class="profile">
      <van-col span="1" />
      <van-col span="6">
        <img
          :src="this.avatar ? this.avatar : icon.default_avatar"
          width="68px"
          height="68px"
        />
      </van-col>
      <van-col span="10">
        <van-row class="nickname"> {{ fname }} </van-row>
        <van-row class="username"> {{ email }} </van-row>
      </van-col>
      <van-col span="6" style="text-align: right"> </van-col>
      <van-col span="1" />
    </van-row>
    <van-cell-group>
      <van-cell
        title="My Courses"
        is-link
        icon="newspaper-o"
        @click="onMyCourses"
        label="Manage My Courses"
      />
      <van-cell
        title="Create a Task"
        is-link
        icon="records"
        label="Volunteers Only"
        @click="onCreateTask"
      />
      <van-cell
        title="Manage Courses"
        is-link
        icon="apps-o"
        label="Administrators Only"
        @click="onUnderConstruction"
      />
      <van-cell
        title="Manage Volunteers"
        is-link
        icon="friends-o"
        label="Administrators Only"
        @click="onUnderConstruction"
      />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "User_Main_Me",
  data() {
    return {
      avatar: null,
      fname: "Full Name",
      email: "student@my.bcit.ca",
      icon: {
        default_avatar: require("@/assets/default_avatar.png"),
      },
    };
  },
  methods: {
    onMyCourses() {
      this.$router.push({
        name: "User_Me_Courses",
      });
    },
    onCreateTask() {
      this.$router.push({
        name: "User_Me_CreateTask",
      });
    },
    onUnderConstruction() {
      this.$toast("Under Construction.\n\nPlease Come Back Later.");
    },
  },
  mounted() {
    let self = this;

    self.$toast.loading({
      message: "Loading...",
      forbidClick: true,
    });

    this.$axios({
      method: "POST",
      headers: { "content-type": "application/json" },
      url: "/user/info",
      data: {
        uid: self.$store.state.uid,
        token: self.$store.state.token,
      },
    })
      .then((res) => {
        if (0 != res.data.code) {
          return self.$toast.fail(res.data.message);
        }
        //console.log(res.data);
        self.avatar = res.data.data[0].head;
        self.fname = res.data.data[0].fname;
        self.email = res.data.data[0].email;
        self.$toast.clear();
      })
      .catch(function (error) {
        self.$toast.fail(error);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  padding: 15px 0px 0px 0px;
  text-align: left;
}

.profile {
  background-color: #ffffff;
  margin-bottom: 10px;
}

.nickname {
  padding-top: 10px;
  font-size: 1.2em;
}

.username {
  padding-top: 5px;
  font-size: 0.9em;
  color: #7a869a;
}

.level {
  padding-top: 10px;
  font-size: 0.9em;
  color: #7a869a;
}

.level_icon {
  padding-top: 7px;
}

img {
  border-radius: 10px;
}
</style>
