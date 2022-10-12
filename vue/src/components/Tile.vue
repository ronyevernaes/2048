<script lang="ts">
export default { name: 'TileComponent' };
</script>

<script setup lang="ts">
defineProps({
  value: {
    type: Number,
    required: false,
  },
});
</script>

<template>
  <div class="tile">
    <h2>{{ !!value || value !== 0 ? value : '' }}</h2>
  </div>
</template>

<style scoped>
.tile {
  position: absolute;
  transition: transform 100ms;
  width: 75px;
  height: 75px;
  border: 1px solid #03071e;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  z-index: 0;
}
</style>
