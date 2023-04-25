<template>
  <div class="modal">
    <header>
      <h2>New Article</h2>
    </header>

    <form @submit.prevent="emit('submit')" class="modal__form" id="new-article-form">
      <div class="modal__form-section">
        <label for="article-title">
          <div class="modal__form-field-name">Title</div>
          <input
            class="modal__form-element modal__form-element--title"
            type="text"
            v-model="newArticleModal.title"
            name="article-title" id="article-title"
            required
          >
        </label>
      </div>

      <div class="modal__form-section modal__form-section--content">
        <label for="article-content" class="modal__form-label modal__form-label--content">
          <div class="modal__form-field-name">Content</div>
          <textarea
            class="modal__form-element modal__form-element--content"
            name="article-content"
            id="article-content"
            v-model="newArticleModal.content"
            required
          ></textarea>
        </label>
      </div>
    </form>

    <div class="modal__action-buttons">
      <app-button
        class="modal__action-button modal__action-button--cancel"
        @click="emit('click:cancel')"
      >
        Cancel
      </app-button>
      <app-button type="submit" form="new-article-form">Submit</app-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, reactive } from 'vue';
import AppButton from '@/components/AppButton.vue';

const emit = defineEmits<{(e: 'click:cancel'): void
  (e: 'submit'): void
}>();

type NewArticleModal = {
  title: string;
  content: string;
}

const newArticleModal = reactive<NewArticleModal>({
  title: '',
  content: '',
});
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  width: 700px;
  max-width: 100%;

  // @TODO Remove
  height: 3000px;
  max-height: 100%;
}

.modal__form {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.modal__form-section {
  &--content {
    flex: 1;
  }
}

.modal__form-section + .modal__form-section {
  margin-top: 20px;
}

.modal__form-label {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal__form-field-name {
  margin-bottom: 10px;
}

.modal__form-element {
  width: 100%;

  &--title {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  }

  &--content {
    height: 100%;
    max-height: 500px;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    resize: none;
  }
}

.modal__action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 40px;
}

.modal__action-button {
  &--cancel {
    --color: #F57474;
  }
}
</style>
