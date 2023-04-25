<template>
  <div class="map-container">
    <app-sidebar
      @add:destination="zoomInCountry"
      @remove:destination="removeCountryLayers"
      @adjust-color:destination="adjustCountryLayersColor"
    />
    <world-map ref="worldMapRef" @update:map-state="updateMapState" />
  </div>
  <div v-if="mapState === 'LOADING'" class="loader-container">
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppSidebar from '@/components/AppSidebar.vue';
import WorldMap from '@/components/WorldMap.vue';
import { MapState } from '@/types/MapState';

import 'maplibre-gl/dist/maplibre-gl.css';

const worldMapRef = ref<InstanceType<typeof WorldMap> | null>(null);

const mapState = ref<MapState>('IDLE');
const mapOpacity = computed(() => (mapState.value === 'SUCCESS' ? 1 : 0));

const updateMapState = (state: MapState) => {
  mapState.value = state;
};

const zoomInCountry = (countryIso: string) => {
  worldMapRef.value?.zoomInCountry(countryIso);
};

const removeCountryLayers = (countryIso: string) => {
  worldMapRef.value?.removeCountryLayers(countryIso);
};

const adjustCountryLayersColor = (countryIso: string, color: string) => {
  worldMapRef.value?.adjustCountryLayersColor(countryIso, color);
};
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

.map-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  width: 100vw;
  height: 100vh;
  opacity: v-bind(mapOpacity);
}

.sidebar {
  z-index: 1;
  isolation: isolate;
}
</style>
