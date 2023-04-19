<template>
  <div class="sidebar">
    <div>
      {{ JSON.stringify(destinations) }}
    </div>
    <div v-for="(destination, index) in destinations" :key="`${destination}-${index}`">
      <div>
        <template v-if="editedDestination.index === index">
          <form @submit.prevent="updateDestination">
            <input v-model="editedDestination.name" />
            <button type="submit" hidden></button>
          </form>
        </template>
        <template v-else>
          {{ destination.name }}
        </template>
        <button @click="enterEditMode(index)">Edit</button>
        <button @click="removeDestination(index)">Delete</button>
      </div>
    </div>

    <form @submit.prevent="addDestination">
      <div>
        <input v-model="newDestination" />
      </div>
      <div>
        <button type="submit" :disabled="!newDestination">Add destination</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, reactive, ref } from 'vue';
import { countriesIsoAlpha3 } from '@/constants/countriesIso';

type Destination = {
  name: string;
  iso: string;
}

const emit = defineEmits<{(event: 'add:destination', iso: string): void;
  (event: 'remove:destination', iso: string): void
  }>();

const newDestination = ref<string>('');
const destinations = reactive<Destination[]>([]);
const editedDestination = reactive<Destination & { index: number }>({ name: '', iso: '', index: -1 });

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
  }
};

const enterEditMode = (index: number) => {
  editedDestination.name = destinations[index].name;
  editedDestination.iso = destinations[index].iso;
  editedDestination.index = index;
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
  }
  emit('add:destination', destinationIso);
};
</script>
