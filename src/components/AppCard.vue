<template>
  <component :is="is ?? 'div'" class="card">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  color: {
    type: String,
    required: false,
    default: () => '#ffffff',
  },
  is: {
    type: String,
    required: false,
    default: () => undefined,
  },
});
</script>

<style lang="scss" scoped>
.card {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 5px;
  display: flex;
  padding: 20px 10px 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 10px;
    background: v-bind(color);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
}
</style>
