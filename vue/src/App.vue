<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- <header>
    <nav></nav>
  </header> -->
  <main>
    <RouterView />
  </main>
  <!-- <footer>Ronye Vernaes &copy; 2022</footer> -->
</template>

<style scoped>
main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
