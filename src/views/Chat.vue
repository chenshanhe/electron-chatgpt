<template>
  <div class="app_main-div">
    <v-system-bar color="teal-lighten-2" window>
      <v-icon icon="mdi-wifi-strength-4"></v-icon>
      <v-icon icon="mdi-signal" class="ms-2"></v-icon>
      <v-icon icon="mdi-battery" class="ms-2"></v-icon>

      <span class="ms-2">3:13PM</span>
    </v-system-bar>
    <vue-particles
        color="#fff"
        :particleOpacity="0.9"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="4"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        class="lizi particle-background"
      >
      </vue-particles>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.app_main-div{
    background-image: url("../assets/images/background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    width: 100vw;
}
</style>