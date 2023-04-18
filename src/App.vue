<template>
  <div ref="mapContainer" class="map-container" />
  <div v-if="mapState === 'LOADING'" class="loader-container">
    <div class="lds-ripple">
      <div />
      <div />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, onBeforeUnmount, onMounted, ref,
} from 'vue';
import { FilterSpecification, Map as MapLibreGLMap } from 'maplibre-gl';
import * as turf from '@turf/turf';
import fetchData from './services';

type MapState = 'IDLE' | 'LOADING' | 'SUCCESS'

export default defineComponent({
  name: 'App',
  setup() {
    const input = ref('');
    const results = ref([]);

    const mapContainer = ref<HTMLDivElement | null>(null);
    const mapState = ref<MapState>('IDLE');
    const mapOpacity = computed(() => (mapState.value === 'SUCCESS' ? 1 : 0));

    const onClick = async () => {
      const { data } = await fetchData(input.value);
      results.value = data.data.Get.FeedItem;
    };

    // Function to zoom to a specific layer
    const zoomToLayer = (map: MapLibreGLMap, layerId: string) => {
      // Get all features of the specific layer currently in the map view
      const layerFeatures = map.queryRenderedFeatures(undefined, { layers: [layerId] });

      // Check if there are any features in the layer
      if (layerFeatures.length === 0) {
        console.error(`No features found in layer: ${layerId}`);
        return;
      }

      // Create a FeatureCollection from the layer features
      const featureCollection = turf.featureCollection(layerFeatures);

      // Calculate the bounding box for the layer features
      const layerBoundingBox = turf.bbox(featureCollection);

      // Zoom to the layer features
      map.fitBounds([
        [layerBoundingBox[0], layerBoundingBox[1]],
        [layerBoundingBox[2], layerBoundingBox[3]],
      ], {
        padding: {
          top: 20, bottom: 20, left: 20, right: 20,
        },
        animate: true,
      });
    };

    onMounted(() => {
      mapState.value = 'LOADING';
      if (!mapContainer.value) return;

      const map = new MapLibreGLMap({
        container: mapContainer.value, // container id
        style: 'https://demotiles.maplibre.org/style.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 1, // starting zoom
        minZoom: 1,
      });

      onBeforeUnmount(() => {
        map.remove();
      });

      map.on('idle', () => {
        mapState.value = 'SUCCESS';
      });

      map.once('idle', () => {
        zoomToLayer(map, 'highlighted-country-border');
      });

      map.on('load', () => {
        map.addSource('countries', {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        });

        // Set the ISO 3166-1 alpha-3 code or country name for the specific country (e.g., Brazil)
        const countryCode = 'POL';
        const countryFilter: FilterSpecification = ['in', 'ISO_A3', countryCode];

        map.setPaintProperty(
          'countries-fill',
          'fill-color',
          '#FFFFFF',
        );
        map.setPaintProperty(
          'crimea-fill',
          'fill-color',
          '#FFFFFF',
        );

        // Add a new layer to display all country boundaries
        map.addLayer({
          id: 'countries-borders',
          type: 'line',
          source: 'countries',
          layout: {},
          paint: {
            'line-color': '#333333', // Set the fill color
            'line-opacity': 0.3, // Set the fill opacity
            'line-width': 0.5,
          },
        });

        // Add a new layer to display country boundary
        map.addLayer({
          id: 'highlighted-country-border',
          type: 'line',
          source: 'countries',
          layout: {},
          paint: {
            'line-color': '#333333',
            'line-width': 0.5,
          },
          filter: countryFilter, // Filter by the country's ISO 3166-1 alpha-3 code
        });

        // Add a new layer to highlight the specific country
        map.addLayer({
          id: 'highlighted-country',
          type: 'fill',
          source: 'countries',
          layout: {},
          paint: {
            'fill-color': '#FF0000',
            'fill-opacity': 0.3,
          },
          filter: countryFilter,
        });
      });
    });

    return {
      input,
      results,
      mapContainer,
      mapState,
      mapOpacity,
      onClick,
    };
  },
});
</script>

<style lang="scss">
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
</style>

<style lang="scss" scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  opacity: v-bind(mapOpacity);
}

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
