<template>
  <div class="articles-page">
    <h2>List of articles</h2>
    <div class="articles-page__content">
      <div class="articles-page__articles">
        <ul class="articles-page__list">
          <li v-for="x in 20" :key="x" class="articles-page__list-item">
            <app-card color="#C0C0C0">
              Article {{ x }}
            </app-card>
          </li>
        </ul>
      </div>

      <app-card class="articles-page__article article" color="#f1d624">
        <header class="article__header">
          <h2 class="article__title">
            Article Title
          </h2>

          <p class="article__date">Date added: <i>20/03/2023</i></p>
        </header>

        <p class="article__content">
          Article content
        </p>
      </app-card>
    </div>

    <div class="articles-page__actions">
      <button class="articles-page__action-button" @click="openNewArticleModal">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>

      <button class="articles-page__action-button">
        <font-awesome-icon :icon="['far', 'trash-can']" />
      </button>
    </div>
  </div>

  <app-modal v-if="newArticleModalMetadata.visible" :key="newArticleModalMetadata.key">
    <new-article-modal @click:cancel="closeNewArticleModal" @submit="addNewArticle" />
  </app-modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import AppCard from '@/components/AppCard.vue';
import AppModal from '@/components/AppModal.vue';
import NewArticleModal from '@/components/NewArticleModal.vue';

type NewArticleModalMetadata = {
  key: number;
  visible: boolean;
}

const newArticleModalMetadata = reactive<NewArticleModalMetadata>({
  key: 0,
  visible: false,
});

const openNewArticleModal = () => {
  newArticleModalMetadata.key = Date.now();
  newArticleModalMetadata.visible = true;
};

const closeNewArticleModal = () => {
  newArticleModalMetadata.visible = false;
};

const addNewArticle = () => {
  console.log('adding new article');
};
</script>

<style lang="scss" scoped>
.articles-page {
  max-width: 1536px;
  margin: 0 auto 50px auto;
}

.articles-page__content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
}

.articles-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.articles-page__list-item + .articles-page__list-item {
  margin-top: 20px;
}

.article {
  display: block;
  text-align: left;
  padding: 2rem;
}

.article__title {
  text-align: center;
}

.article__date {
  text-align: right;
}

.articles-page__actions {
  position: fixed;
  bottom: 40px;
  right: 40px;
  display: flex;
  gap: 15px;
}

.articles-page__action-button {
  padding: 20px;
  background: #6652e4;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 50%;
  font-size: 20px;
  color: #ffffff;
  transition: transform 200ms ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
}
</style>
