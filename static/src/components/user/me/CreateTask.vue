<template>
  <div>
    <van-form @submit="onSubmit">
      <van-nav-bar
        title="Create Task"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        fixed
      />
      <div class="content">
        <van-row>
          <van-field
            readonly
            clickable
            :value="courseid"
            label="Course ID"
            placeholder="Click to Choose Course"
            @click="showCourseID = true"
            :rules="[{ required: true, message: 'Please Choose Course' }]"
          />
          <van-popup v-model="showCourseID" position="bottom">
            <van-picker
              title="Choose Course"
              show-toolbar
              :columns="CourseIDs"
              @confirm="onConfirm"
              @cancel="onCancel"
            />
          </van-popup>
          <van-field
            readonly
            :value="course_name"
            label="Course Name"
            placeholder="Choose Course ID First"
          />
          <van-field
            v-model="task_name"
            name="name"
            label="Task Name"
            placeholder="Enter Task Name"
            :rules="[{ required: true, message: 'Please Enter Task Name' }]"
          />
          <van-field
            readonly
            clickable
            name="due"
            :value="due"
            label="Due"
            placeholder="Click to Choose Due"
            @click="showDuePicker = true"
            :rules="[{ required: true, message: 'Please Choose Due' }]"
          />
          <van-popup v-model="showDuePicker" position="bottom">
            <van-datetime-picker
              v-model="current_time"
              type="datetime"
              title="Choose Due"
              @confirm="onConfirmDue"
              @cancel="onCancelDue"
            />
          </van-popup>
        </van-row>
      </div>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit"> Submit </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: "User_Me_CreateTask",
  data() {
    return {
      cid: 0,
      course_data: null,
      CourseIDs: [],
      showCourseID: false,
      courseid: "",
      course_name: "",
      task_name: "",
      due: 0,
      showDuePicker: false,
      current_time: new Date(),
    };
  },
  methods: {
    onSubmit() {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/homework/add",
        data: {
          uid: self.$store.state.uid,
          token: self.$store.state.token,
          cid: this.cid,
          title: this.task_name,
          due: this.due,
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res.data);
            return self.$toast.fail(res.data.message);
          }          
          self.$toast.clear();
          this.$router.go(-1);
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onConfirm(value, index) {
      this.showCourseID = false;
      this.cid = this.course_data[index].id;
      this.courseid = this.course_data[index].courseid;
      this.course_name = this.course_data[index].name;
    },
    onCancel() {
      this.showCourseID = false;
    },
    onConfirmDue(value, index) {
      this.showDuePicker = false;
      this.due = this.dateFtt("yyyy-MM-dd hh:mm:ss", this.current_time);
    },
    onCancelDue() {
      this.showDuePicker = false;
    },
    dateFtt(fmt, date) {
      //author: meizz
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    crtTimeFtt() {
      var crtTime = new Date();
      return this.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);
    },
  },
  mounted() {
    this.due = this.crtTimeFtt();

    let self = this;

    self.$toast.loading({
      message: "Loading...",
      forbidClick: true,
    });

    this.$axios({
      method: "POST",
      headers: { "content-type": "application/json" },
      url: "/course/list",
      data: { uid: self.$store.state.uid },
    })
      .then((res) => {
        if (0 != res.data.code) {
          console.log(res.data);
          return self.$toast.fail(res.data.message);
        }
        this.course_data = res.data.data.courses;
        for (let index in this.course_data) {
          this.CourseIDs.push(this.course_data[index].name);
        }
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
  width: 100%;
  height: 100%;
  padding: 65px 0px 7px 0px;
}

* >>> .van-field__label {
  width: 7em;
}
</style>
