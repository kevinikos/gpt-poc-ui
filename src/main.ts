import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPencil, faDharmachakra, faSpinner, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faTrashCan, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import App from './App.vue';

library.add(faPencil, faTrashCan, faDharmachakra, faSpinner, faSquarePlus, faCircle);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
