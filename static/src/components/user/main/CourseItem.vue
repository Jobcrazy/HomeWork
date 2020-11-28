<template>
  <div class="fitem">
    <van-row>
      <van-col span="1" />
      <van-col span="5">
        <van-row class="logo">
          <van-image :src="course.logo" lazy-load height="50px" width="50px" />
        </van-row>
      </van-col>
      <van-col span="13">
        <van-row class="cid"> {{ course.courseid }} </van-row>
        <van-row class="cname">
          <van-col> {{ course.name }} </van-col>
          <van-col span="1" />
        </van-row>
        <van-row class="instructor">
          <van-col> {{ course.instructor }} </van-col>
          <van-col span="1" />
        </van-row>
      </van-col>
      <van-col span="4">
        <van-row class="term"> {{ course.term }}</van-row>
        <van-row class="follow">
          <van-button
            id="login"
            type="primary"
            size="mini"
            v-if="!course.followed"
            style="width: 55px"
            @click="handleFollow(course.id)"
          >
            Follow
          </van-button>
          <van-button
            id="login"
            type="danger"
            size="mini"
            v-if="course.followed"
            style="width: 55px"
            @click="handleUnFollow(course.id)"
          >
            Unfollow
          </van-button>
        </van-row>
      </van-col>
    </van-row>
    <van-divider />

    <div></div>
  </div>
</template>

<script>
export default {
  name: "Main_Cours_Item",
  props: {
    course: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleFollow(id) {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/course/follow",
        data: {
          uid: self.$store.state.uid,
          token: self.$store.state.token,
          cid: id,
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            return self.$toast.fail(res.data.message);
          }
          self.course.followed = 1;
          self.$toast.clear();
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
    handleUnFollow(id) {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/course/unfollow",
        data: {
          uid: self.$store.state.uid,
          token: self.$store.state.token,
          cid: id,
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            return self.$toast.fail(res.data.message);
          }
          self.course.followed = 0;
          self.$toast.clear();
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cid {
  font-size: 0.85rem;
  font-weight: bold;
}

.cname {
  padding-top: 5px;
  font-size: 0.85rem;
}

.instructor {
  padding-top: 5px;
  font-size: 0.85rem;
}

.term {
  font-size: 0.85rem;
}

.follow {
  padding-top: 5px;
}
</style>
