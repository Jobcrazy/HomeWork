<template>
  <div class="fitem">
    <van-row>
      <van-col span="1" />
      <van-col span="5">
        <van-row class="logo">
          <van-image :src="task.logo" lazy-load height="50px" width="50px" />
        </van-row>
      </van-col>
      <van-col span="13">
        <van-row class="cid"> {{ task.title }} </van-row>
        <van-row class="cname">
          <van-col> {{ task.name }} </van-col>
          <van-col span="1" />
        </van-row>
        <van-row class="instructor">
          <van-col> {{ task.due }} </van-col>
          <van-col span="1" />
        </van-row>
      </van-col>
      <van-col span="4">
        <van-row class="term" style="margin-bottom: 5px"></van-row>
        <van-row class="follow">
          <van-button
            id="login"
            type="primary"
            size="mini"
            v-if="!task.done"
            style="width: 55px"
            @click="onDone"
          >
            Done
          </van-button>
          <van-button
            id="login"
            type="danger"
            size="mini"
            v-if="task.done"
            style="width: 55px"
            @click="onUndo"
          >
            Undo
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
  name: "Main_Task_Item",
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onUndo() {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/homework/unfinished",
        data: {
          uid: self.$store.state.uid,
          token: self.$store.state.token,
          cid: this.task.cid,
          kid: this.task.kid,
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res.data);
            return self.$toast.fail(res.data.message);
          }
          this.$emit("reloadData");
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
    onDone() {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/homework/done",
        data: {
          uid: self.$store.state.uid,
          token: self.$store.state.token,
          cid: this.task.cid,
          kid: this.task.kid,
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res.data);
            return self.$toast.fail(res.data.message);
          }
          this.$emit("reloadData");
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
