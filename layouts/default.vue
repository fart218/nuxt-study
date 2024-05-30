<template>
  <v-card>
    <v-layout>
      <v-app-bar style="background-color: darkgray;"></v-app-bar>
      <v-navigation-drawer
        floating
        permanent
      >
        <v-list
          density="compact"
          nav
        >
          <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-forum" title="About" value="about" to="/about"></v-list-item>
          <v-list-item prepend-icon="mdi-application-outline" title="load_test" value="test" to="/test"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main><slot /></v-main>
    </v-layout>
  </v-card>
</template>