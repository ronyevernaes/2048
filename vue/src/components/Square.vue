<script lang="ts">
export default { name: 'SquareComponent' };
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
  <div class="square">
    <!-- <h1>{{ value !== 0 ? value : '' }}</h1> -->
  </div>
</template>

<style scoped>
.square {
  width: 75px;
  height: 75px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
