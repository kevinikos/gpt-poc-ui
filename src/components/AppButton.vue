<template>
  <button class="button" :class="`button--${size}`"><slot /></button>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';

type ButtonSize = 'regular' | 'small';

defineProps({
  size: {
    type: String as PropType<ButtonSize>,
    required: false,
    default: () => 'regular',
  },
});
</script>

<style lang="scss" scoped>
.button {
  --_color: var(--color, #6652e4);

  background: none;
  margin-top: auto;
  border: 2px solid var(--_color);
  border-radius: 5px;
  color: var(--_color);
  transition: all 150ms linear;
  font-weight: 700;

  &:hover {
    cursor: pointer;
    color: white;
    background: var(--_color);
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
