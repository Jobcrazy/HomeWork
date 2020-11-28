<template>
  <div>
    <van-search v-model="keyword" placeholder="Search by Course ID" style="margin-bottom:15px;"/>
    <van-row v-for="course in courses" :key="course.id">
      <course_item :course="course" />
    </van-row>
  </div>
</template>

<script>
import Course_Item from "./CourseItem";
export default {
  name: "User_Main_Courses",
  data() {
    return {
      keyword: "",
      courses: [],
    };
  },
  components: {
    course_item: Course_Item,
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
      url: "/course/list",
      data: { uid: self.$store.state.uid },
    })
      .then((res) => {
        if (0 != res.data.code) {
          console.log(res.data);
          return self.$toast.fail(res.data.message);
        }    
        for (let index in res.data.data.courses) {
          res.data.data.courses[index].followed = 0;
          for (let follow_index in res.data.data.followed) {
            if (
              res.data.data.followed[follow_index].cid == res.data.data.courses[index].id
            ) {
              res.data.data.courses[index].followed = 1;
            }
          }
        }
        self.courses = res.data.data.courses;
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
</style>
