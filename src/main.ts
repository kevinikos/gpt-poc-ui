import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import App from './App.vue';

library.add(faPencil, faTrashCan);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
