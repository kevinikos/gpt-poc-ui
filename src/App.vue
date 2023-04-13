<template>
  <div class="window">
    <h2>Ask question</h2>
    <label for="textarea">
      <textarea name="textarea" v-model="input"></textarea>
    </label>
    <button @click="onClick">Send</button>
  </div>
  <div class="result">
    <div class="result__item" v-for="(result, index) in results" :key="index">
      <p v-if="result._additional.answer.hasAnswer" v-html="result._additional.answer.result" />
      <span v-else>No answer</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import fetchData from './services';

export default defineComponent({
  name: 'App',
  setup() {
    const input = ref('');
    const results = ref([]);

    const onClick = async () => {
      const { data } = await fetchData(input.value);
      results.value = data.data.Get.FeedItem;
    };

    return {
      input,
      results,
      onClick,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.window {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
