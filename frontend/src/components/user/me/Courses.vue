<template>
  <div>
    <van-nav-bar
      title="My Courses"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="content">
      <van-row
        v-for="course in courses"
        :key="course.id"        
      >
        <course_item :course="course" v-on:reloadData="loadData"/>
      </van-row>
    </div>
  </div>
</template>

<script>
import Course_Item from "./CourseItem";
export default {
  name: "User_Me_Courses",
  data() {
    return {
      keyword: "",
      courses: [],
    };
  },
  components: {
    course_item: Course_Item,
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    loadData() {
      let self = this;

      self.$toast.loading({
        message: "Loading...",
        forbidClick: true,
      });

      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/course/list/my",
        data: { uid: self.$store.state.uid },
      })
        .then((res) => {
          if (0 != res.data.code) {
            console.log(res.data);
            return self.$toast.fail(res.data.message);
          }
          self.courses = res.data.data;
          self.$toast.clear();
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
  },
  mounted() {
    this.loadData();
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
</style>
