<script lang="ts">
export default { name: 'ModalComponent' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropType } from 'vue';

import { GameStatus } from '../types';

const props = defineProps({
  status: {
    type: String as PropType<GameStatus>,
    required: false,
  },
});

const show = ref<boolean>(false);
const title = ref<string>('');
const message = ref<string>('');

const onChangeStatus = (): void => {
  switch (props.status) {
    case GameStatus.Won:
      title.value = 'Congratulations! =)';
      message.value =
        "You have won! You can continue playing... Let's see where you get";
      show.value = true;
      break;

    case GameStatus.Lost:
      title.value = 'Ohh! =(';
      message.value = 'You have lost! Keep on trying. Practice makes a master';
      show.value = true;
      break;
  }
};

const emit = defineEmits(['cancel']);

const onCancel = (): void => {
  show.value = false;
  emit('cancel');
};

watch(
  () => props.status,
  () => onChangeStatus()
);
</script>

<template>
  <a-modal
    centered
    closable
    v-model:visible="show"
    :footer="null"
    :title="title"
    @cancel="onCancel"
  >
    {{ message }}
  </a-modal>
</template>
