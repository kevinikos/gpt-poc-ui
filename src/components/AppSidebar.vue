<template>
  <div class="sidebar">
    <h2>Plan your delivery</h2>

    <app-card color="#6652e4">
      <form @submit.prevent="addDestination" class="sidebar__new-destination">
        <input class="sidebar__new-destination-input" v-model="newDestination" />
        <button type="submit" :disabled="!newDestination" class="sidebar__new-destination-submit">
          <font-awesome-icon :icon="['far', 'square-plus']" />
        </button>
      </form>
    </app-card>

    <h3>Destinations</h3>

    <div class="sidebar__destinations-container">
      <ul class="sidebar__destinations">
        <app-card
          is="li"
          :key="`${destination.name}-${index}`"
          class="sidebar__destination"
          @click="showSummary(destination)"
          v-for="(destination, index) in destinations"
          :color="getDangerLevelColor(destination)"
        >
          <template v-if="editedDestination.index === index">
            <form
              @submit.prevent="updateDestination"
              @keydown.esc="exitEditMode"
              @click.stop=""
              class="sidebar__destination-edit"
            >
              <input
                class="sidebar__destination-edit-input"
                v-model="editedDestination.name"
              />
              <button type="submit" hidden></button>
            </form>
          </template>
          <template v-else>
            <div class="sidebar__destination-detail">
              {{ destination.name }}
            </div>
          </template>
          <button class="sidebar__action-button" @click.stop="enterEditMode(index)">
            <font-awesome-icon :icon="['fas', 'pencil']" />
          </button>
          <button class="sidebar__action-button" @click.stop="removeDestination(index)">
            <font-awesome-icon :icon="['far', 'trash-can']" />
          </button>
        </app-card>
      </ul>
    </div>

    <app-button
      class="sidebar__submit"
      :class="`sidebar__submit--${summary.type.toLowerCase()}`"
      @click="prepareSummary"
      :disabled="isSummaryLoading"
    >
      <template v-if="isSummaryLoading">
        Loading <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </template>
      <template v-else>
        Submit
      </template>
    </app-button>

    <app-modal v-if="summaryModal.visible" :key="summaryModal.key">
      <header class="summary-modal__header">
        <h3>{{ summaryModal.title }}</h3>
        <div>
          Risk level: {{ summaryModal.riskLevel.value }}
          <font-awesome-icon
            class="summary-modal__risk-level-icon"
            :icon="['fas', 'circle']"
            :style="{ color: summaryModal.riskLevel.color }"
          />
        </div>
      </header>
      <h4>Found risks</h4>
      <p>
        {{ summaryModal.content }}
      </p>
      <h4>Related articles</h4>
      <ul class="sidebar__modal-articles">
        <li :key="link" v-for="link in summaryModal.links">{{ link }}</li>
      </ul>
    </app-modal>

    <app-modal v-if="errorModal.visible" :key="errorModal.key">
      <h3>{{ errorModal.title }}</h3>
      <p>
        {{ errorModal.content }}
      </p>
    </app-modal>
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits, reactive, ref, watch,
} from 'vue';
import { countriesIsoAlpha3 } from '@/constants/countriesIso';
import AppModal from '@/components/AppModal.vue';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import { Destination, EditedDestination } from '@/types/FormState';
import { useApiProxy } from '@/composables/useApiProxy';
import { SummaryItem } from '@/services/apiProxy';

const emit = defineEmits<{(event: 'add:destination', iso: string): void;
  (event: 'remove:destination', iso: string): void;
  (event: 'adjust-color:destination', iso: string, color?: string): void;
  }>();

const newDestination = ref<string>('');
const destinations = reactive<Destination[]>([]);
const editedDestination = reactive<EditedDestination>({ name: '', iso: '', index: -1 });

const {
  fetchSummary, removeDSummaryFromRecord, summary, isSummaryLoading,
} = useApiProxy();

const addDestination = () => {
  if (!newDestination.value) return;

  const destinationIso = countriesIsoAlpha3[newDestination.value];
  if (!destinationIso) {
    // @TODO display notification
    console.error('Count not find ISO for given country:', newDestination.value);
    return;
  }

  destinations.push({
    name: newDestination.value,
    iso: destinationIso,
  });
  newDestination.value = '';

  emit('add:destination', destinationIso);
};

const removeDestination = (index: number) => {
  const removedDestination = destinations[index];
  destinations.splice(index, 1);

  const matchingDestination = destinations.find((destination) => (
    destination.iso === removedDestination.iso));
  if (!matchingDestination) {
    emit('remove:destination', removedDestination.iso);
    removeDSummaryFromRecord(removedDestination.name);
  }
};

const enterEditMode = (index: number) => {
  editedDestination.name = destinations[index].name;
  editedDestination.iso = destinations[index].iso;
  editedDestination.index = index;
};

const exitEditMode = () => {
  editedDestination.name = '';
  editedDestination.iso = '';
  editedDestination.index = -1;
};

const updateDestination = () => {
  const destinationIso = countriesIsoAlpha3[editedDestination.name];
  if (!destinationIso) {
    // @TODO display notification
    console.error('Count not find ISO for given country:', newDestination.value);
    return;
  }

  destinations[editedDestination.index] = {
    name: editedDestination.name,
    iso: destinationIso,
  };
  editedDestination.index = -1;

  const matchingDestination = destinations.find((destination) => (
    destination.iso === editedDestination.iso));
  if (!matchingDestination) {
    emit('remove:destination', editedDestination.iso);
    removeDSummaryFromRecord(editedDestination.name);
  }
  emit('add:destination', destinationIso);
};

const prepareSummary = () => fetchSummary(destinations);

const getDestinationSummary = (destination: Destination): SummaryItem | undefined => {
  if (summary.value.type !== 'SUCCESS') return undefined;

  return summary.value.data[destination.name.toLowerCase()];
};

const getDangerLevelColor = (destination: Destination): string => {
  const dangerLevelColors: Record<string, string> = {
    1: '#00CC66',
    2: '#32CD32',
    3: '#66CD00',
    4: '#99CC00',
    5: '#CCCC00',
    6: '#FFD700',
    7: '#FFA500',
    8: '#FF8C00',
    9: '#FF6347',
    10: '#FF0000',
  };

  const destinationSummary = getDestinationSummary(destination);
  if (!destinationSummary) return '';

  return dangerLevelColors[destinationSummary.dangerous_level];
};

watch(summary, (newSummary) => {
  if (newSummary.type !== 'SUCCESS') return;

  Object.values(newSummary.data).forEach((item) => {
    const destinationIso = countriesIsoAlpha3[item.country];
    if (!destinationIso) {
      // @TODO display notification
      console.error('Count not find ISO for given country:', item.country);
      return;
    }

    emit('adjust-color:destination', destinationIso, getDangerLevelColor({
      name: item.country,
      iso: destinationIso,
    }));
  });
});

type SummaryModalContent = {
  key: number;
  visible: boolean;
  title: string;
  content: string;
  links: string[];
  riskLevel: {
    value: string;
    color: string;
  };
}

const summaryModal = reactive<SummaryModalContent>({
  key: 0,
  visible: false,
  title: '',
  content: '',
  links: [],
  riskLevel: {
    value: '',
    color: '',
  },
});

type ErrorModal = {
  key: number;
  visible: boolean;
  title: string;
  content: string;
}

const errorModal = reactive<ErrorModal>({
  key: 0,
  visible: false,
  title: '',
  content: '',
});

const showSummary = (destination: Destination) => {
  if (summary.value.type !== 'SUCCESS') {
    errorModal.key = Date.now();
    errorModal.title = 'Could not find summary for country';
    errorModal.content = 'Please re-regenerate your response by clicking "Submit" button';
    errorModal.visible = true;

    return;
  }

  const summaryForCountry = getDestinationSummary(destination);
  if (!summaryForCountry) {
    errorModal.key = Date.now();
    errorModal.title = 'Could not find summary for country';
    errorModal.content = 'Please re-regenerate your response by clicking "Submit" button';
    errorModal.visible = true;
    return;
  }

  emit('add:destination', destination.iso);

  summaryModal.key = Date.now();
  summaryModal.title = summaryForCountry.country;
  summaryModal.content = summaryForCountry.summary;
  summaryModal.links = summaryForCountry.links;
  summaryModal.riskLevel = {
    value: summaryForCountry.dangerous_level,
    color: getDangerLevelColor(destination),
  };
  summaryModal.visible = true;
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.sidebar__new-destination {
  display: flex;
  width: 100%;
}

.sidebar__new-destination-input {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  width: 100%;
}

.sidebar__new-destination-submit {
  border: none;
  background: none;
  color: #6652e4;
  font-size: 25px;
  padding: 0;
  margin-left: 10px;

  &:disabled {
    cursor: not-allowed;
  }
}

.sidebar__destinations-container {
  flex: 1;
  overflow-y: scroll;
  padding: 0 5px;
}

.sidebar__destinations {
  margin: 0 0 20px 0;
  padding: 0;
  list-style: none;
}

.sidebar__destination + .sidebar__destination {
  margin-top: 15px;
}

.sidebar__destination-edit {
  width: 100%;
  text-align: left;
  margin-right: 20px;
}

.sidebar__destination-edit-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}

.sidebar__destination-detail {
  width: 100%;
  text-align: left;
}

.sidebar__action-button {
  background: none;
  border: none;
  color: #6652e4;
  font-size: 15px;

  &:hover {
    cursor: pointer;
    color: darken(#6652e4, 30%);
  }
}

.sidebar__submit {
  margin-top: auto;
}

.sidebar__modal-articles {
  word-wrap: break-word;
}

.summary-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-modal__risk-level-icon {
  margin-left: 5px;
}
</style>
