import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPencil, faDharmachakra, faSpinner, faCircle, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faTrashCan, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { router } from '@/router';
import App from './App.vue';

const main = async () => {
  if (process.env.VUE_APP_MOCK_SERVICE_WORKER === 'enabled') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }

  library.add(faPencil, faTrashCan, faDharmachakra, faSpinner, faSquarePlus, faCircle, faPlus);

  createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app');
};

main();
