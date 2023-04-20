<template>
  <button class="button" :class="`button--${size}`"><slot /></button>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';

type ButtonSize = 'regular' | 'small';

defineProps({
  size: {
    type: String as PropType<ButtonSize>,
    required: true,
    default: () => 'regular',
  },
});
</script>

<style lang="scss" scoped>
.button {
  background: none;
  margin-top: auto;
  border: 2px solid #6652e4;
  border-radius: 5px;
  color: #6652e4;
  transition: all 150ms linear;

  &:hover {
    cursor: pointer;
    color: white;
    background: #6652e4;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &--regular {
    padding: 10px;
    font-size: 14px;
  }

  &--small {
    padding: 5px;
    font-size: 14px;
  }
}
</style>
