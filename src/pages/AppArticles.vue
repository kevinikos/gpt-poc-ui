<template>
  <div class="articles-page">
    <h2>List of articles</h2>
    <div class="articles-page__content">
      <div class="articles-page__articles">
        <ul v-if="articlesData.length" class="articles-page__list">
          <li v-for="article in articlesData" :key="article.id" class="articles-page__list-item">
            <app-card color="#C0C0C0" @click="showArticle(article.id)">
              <h3>{{ article.title }}</h3>
            </app-card>
          </li>
        </ul>
      </div>

      <app-card v-if="selectedArticle" class="articles-page__article article" color="#f1d624">
        <header class="article__header">
          <h2 class="article__title">
            {{ selectedArticle.title }}
          </h2>

          <p class="article__date">Date added: <i>{{ selectedArticle.createdAt }}</i></p>
        </header>

        <p class="article__content">
          {{ selectedArticle.content }}
        </p>
      </app-card>
      <h3 v-else-if="!selectedArticle && articlesData.length">
        Please select an article from the left sidebar
      </h3>
    </div>

    <div class="articles-page__actions">
      <button class="articles-page__action-button" @click="openNewArticleModal">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>

      <button class="articles-page__action-button" @click="removeArticle(selectedArticle.id)">
        <font-awesome-icon v-if="isDeleteArticleLoading" :icon="['fas', 'spinner']" spin />
        <font-awesome-icon v-else :icon="['far', 'trash-can']" />
      </button>
    </div>
  </div>

  <div v-if="areArticlesLoading" class="loader-container">
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>

  <app-modal v-if="newArticleModalMetadata.visible" :key="newArticleModalMetadata.key">
    <new-article-modal
      :is-submitting="isPostArticleLoading"
      @click:cancel="closeNewArticleModal"
      @submit="createArticle" />
  </app-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useApiProxy } from '@/composables/useApiProxy';
import type { Article } from '@/composables/useApiProxy';
import type { PostArticleDTO } from '@/types/ArticleDTO';
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

const {
  articles,
  areArticlesLoading,
  isPostArticleLoading,
  isDeleteArticleLoading,
  fetchArticles,
  postArticle,
  deleteArticle,
} = useApiProxy();

const articlesData = computed(() => (articles.value.type === 'SUCCESS' ? articles.value.data : []));

const openNewArticleModal = () => {
  newArticleModalMetadata.key = Date.now();
  newArticleModalMetadata.visible = true;
};

const closeNewArticleModal = () => {
  newArticleModalMetadata.visible = false;
};

const selectedArticle = ref<Article | null>(null);

const showArticle = (articleId: string) => {
  selectedArticle.value = articlesData.value.find((article) => article.id === articleId) ?? null;
};

const createArticle = (articleDto: PostArticleDTO) => {
  postArticle(articleDto, (data) => {
    selectedArticle.value = data;
    closeNewArticleModal();
  });
};

const removeArticle = (articleId: string) => {
  deleteArticle(articleId, () => {
    selectedArticle.value = null;
  });
};

fetchArticles((data) => {
  selectedArticle.value = data.length ? data[0] : null;
});
</script>

<style lang="scss" scoped>
.loader-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.articles-page {
  max-width: 1536px;
  margin: 0 auto 50px auto;
}

.articles-page__content {
  display: grid;
  grid-template-columns: 1fr 3fr;
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
