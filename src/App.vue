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

<style lang="scss">
@import "maplibre-gl/dist/maplibre-gl.css";

body {
  margin: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#modal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

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

<style id="animations">
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #f1d624;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
