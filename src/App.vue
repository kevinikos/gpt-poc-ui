<template>
  <router-view></router-view>
</template>

<style lang="scss">
:root {
  --font-family: Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#modal {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

input, textarea {
  font-family: var(--font-family);
}
</style>
