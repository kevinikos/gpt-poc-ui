<template>
  <component :is="is" class="card">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  color: {
    type: String,
    required: false,
    default: () => '#6652e4',
  },
  is: {
    type: String,
    required: true,
    default: () => 'div',
  },
});
</script>

<style lang="scss" scoped>
.card {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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
    opacity: 0.4;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
}
</style>
