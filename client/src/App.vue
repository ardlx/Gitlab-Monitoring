<template>
  <v-app id="Myapp">
    <drawer></drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import drawer from "./components/Drawer";
export default {
  components: {
    drawer
  },
  name: "App",

  data: () => ({
    //
  })
};
</script>
<style>
.a {
  text-decoration: underline;
}
#transparent {
  background-color: transparent;
}
#MyButton {
  background-color: transparent;
  border-color: blue;
}
#MyInput {
  background-color: transparent;
  border-color: black;
}
#MyCard {
  max-height: calc(100vh - 55px);
  min-height: calc(100vh - 55px);
  /* background-color: transparent; */
  /* background: rgba(210, 210, 210, 0.5); */
  overflow-y: auto;
  overflow-x: auto;
}
#Myapp {
  /* font-family: Montserrat-Medium; */
  font-family: calibri;
  background: rgba(210, 210, 210, 0.5);
  /* background-image: url("./assets/Image/background.jpg"); */
  background-size: cover;
  background-repeat: no-repeat !important;
}
.content {
  max-height: calc(100vh - 97px);
  overflow-y: auto;
  overflow-x: auto;
}
</style>