<template>
  <div class="login">
    <van-row class="head"></van-row>
    <van-row class="foot">
      <van-col span="1" />
      <van-col span="22">
        <div class="login_btn">
          <van-button
            id="login"
            type="info"
            block
            plain
            hairline
            :icon="icon_google"
          >
            Login with Google Account
          </van-button>
        </div>
      </van-col>
      <van-col span="1" />
    </van-row>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      icon_google: require("@/assets/sign-in-with-google.png"),
      auth2: null,
    };
  },
  methods: {
    login(profile) {
      // Login to Homework
      console.log(profile)
      let self = this;
      self.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.$axios({
        method: "POST",
        headers: { "content-type": "application/json" },
        url: "/user/login",
        data: {
          gid: profile.getId(),
          fname: profile.getName(),
          gname: profile.getGivenName(),
          xname: profile.getFamilyName(),
          head: profile.getImageUrl(),
          email: profile.getEmail(),
        },
      })
        .then((res) => {
          if (0 != res.data.code) {
            return self.$toast.fail(res.data.message);
          }
          this.$router.push({ name: "User_Main", query: { id: res.data.id } });
        })
        .catch(function (error) {
          self.$toast.fail(error);
        });
    },
    attachSignin(element) {
      // Init Google Login Callback functions
      let self = this;
      self.auth2.attachClickHandler(
        element,
        {},
        function (googleUser) {
          // Login Success, then login to HomeWork
          let profile = self.auth2.currentUser.get().getBasicProfile();
          self.login(profile);
        },
        function (error) {
          console.log(JSON.stringify(error, undefined, 2));
        }
      );
    },
  },
  mounted() {
    // Init Google Login Button
    this.auth2 = gapi.auth2.init({
      client_id:
        "123727176263-q22g4po6p3q2165ht5fsco8957179j8v.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scope: "profile",
    });
    var googleUser = {};
    this.attachSignin(document.getElementById("login"));
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background-image: url("/static/images/login-bg.jpg");
  background-size: 100% 100%;
}

.foot {
  position: fixed;
  bottom: 50px;
  width: 100%;
  text-align: center;
}
</style>
