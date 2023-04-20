<template>
  <div class="sidebar">
    <h2>Plan your delivery</h2>

    <form @submit.prevent="addDestination">
      <div>
        <input v-model="newDestination" />
      </div>
      <div>
        <button type="submit" :disabled="!newDestination">Add destination</button>
      </div>
    </form>

    <h3>Destinations</h3>

    <div class="sidebar__destinations-container">
      <ul class="sidebar__destinations">
        <li
          :key="`${destination}-${index}`"
          class="sidebar__destination"
          v-for="(destination, index) in destinations"
        >
          <template v-if="editedDestination.index === index">
            <form
              @submit.prevent="updateDestination"
              @keydown.esc="exitEditMode"
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
          <button class="sidebar__action-button" @click="enterEditMode(index)">
            <font-awesome-icon :icon="['fas', 'pencil']" />
          </button>
          <button class="sidebar__action-button" @click="removeDestination(index)">
            <font-awesome-icon :icon="['far', 'trash-can']" />
          </button>
        </li>
      </ul>
    </div>

    <button class="sidebar__submit">
      Submit
    </button>
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
  }
  emit('add:destination', destinationIso);
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
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

.sidebar__destination {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 5px;
  display: flex;
  padding: 20px 10px 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 10px;
    background: rgb(#6652e4, 0.4);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
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
    color: darken(#6652e4, 30%)
  }
}

.sidebar__submit {
  background: none;
  margin-top: auto;
  padding: 15px;
  border: 2px solid #6652e4;
  border-radius: 5px;
  font-size: 17px;
  color: #6652e4;
  transition: all 150ms linear;

  &:hover {
    cursor: pointer;
    color: white;
    background: #6652e4;
  }
}
</style>
