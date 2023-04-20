<template>
  <teleport to="#modal">
    <div v-if="isVisible" class="modal" @keydown.esc="closeModal" @click="closeModal">
      <div class="modal__content" @click.stop="">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(true);

const closeModal = () => {
  isVisible.value = false;
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background: rgba(0, 0, 0, 0.3);
}

.modal__content {
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  background: white;
  border-radius: 5px;
  min-width: 250px;
  max-width: 500px;
}
</style>
