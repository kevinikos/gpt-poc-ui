<template>
  <div ref="mapContainer" />
</template>

<script setup lang="ts">
import {
  defineEmits, defineExpose, onBeforeUnmount, onMounted, ref, shallowRef,
} from 'vue';
import { FilterSpecification, Map as MapLibreGLMap } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { MapState } from '@/types/MapState';

const SOURCE_NAME = 'countries';

const emit = defineEmits<{(e: 'update:map-state', state: MapState): void
}>();

const mapRef = shallowRef<MapLibreGLMap | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);

const getCountryBorderLayerName = (countryIso: string) => `country-border-${countryIso}`;

const getCountryLayerName = (countryIso: string) => `country-${countryIso}`;

const getCountryFilter = (countryIso: string): FilterSpecification => ['==', 'ISO_A3', countryIso];

// Function to zoom to a specific layer
const zoomToLayer = (map: MapLibreGLMap, countryIso: string): boolean => {
  const countryFilter: FilterSpecification = getCountryFilter(countryIso);
  const countryLayer = getCountryBorderLayerName(countryIso);

  const features = map.queryRenderedFeatures(undefined, {
    sourceLayer: countryLayer,
    filter: countryFilter,
  });

  if (!features.length) {
    console.error(`No features found for ISO: ${countryIso}`);
    return false;
  }

  // Create a FeatureCollection from the layer features
  const featureCollection = turf.featureCollection(features);
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
    essential: true,
  });

  return true;
};

onMounted(() => {
  emit('update:map-state', 'LOADING');
  if (!mapContainer.value) return;

  const map = new MapLibreGLMap({
    container: mapContainer.value, // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1, // starting zoom
    minZoom: 1,
    pitchWithRotate: false,
    dragRotate: false,
  });
  mapRef.value = map;

  map.on('idle', () => {
    emit('update:map-state', 'SUCCESS');
  });

  map.on('load', () => {
    map.addSource(SOURCE_NAME, {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    });

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
      source: SOURCE_NAME,
      layout: {},
      paint: {
        'line-color': '#333333', // Set the fill color
        'line-opacity': 0.3, // Set the fill opacity
        'line-width': 0.5,
      },
    });
  });
});

onBeforeUnmount(() => {
  if (mapRef.value) {
    mapRef.value.remove();
    mapRef.value = null;
  }
});

const addCountryBorder = (map: MapLibreGLMap, countryIso: string) => {
  map.addLayer({
    id: getCountryBorderLayerName(countryIso),
    type: 'line',
    source: SOURCE_NAME,
    paint: {
      'line-color': '#333333',
      'line-width': 0.5,
    },
    filter: getCountryFilter(countryIso),
  });
};

const highlightCountry = (map: MapLibreGLMap, countryIso: string) => {
  map.addLayer({
    id: getCountryLayerName(countryIso),
    type: 'fill',
    source: SOURCE_NAME,
    paint: {
      'fill-color': '#6652e4',
      'fill-opacity': 0.3,
    },
    filter: getCountryFilter(countryIso),
  });
};

const zoomToLayerWithAdjustment = (map: MapLibreGLMap, countryIso: string) => {
  const result = zoomToLayer(map, countryIso);
  if (!result) {
    map.zoomTo(1);
    map.once('idle', () => zoomToLayer(map, countryIso));
  }
};

const zoomInCountry = (countryIso: string) => {
  const map = mapRef.value;
  if (!map) return;

  if (map.getLayer(getCountryBorderLayerName(countryIso))) {
    zoomToLayerWithAdjustment(map, countryIso);
    return;
  }

  // Add a new layer to display country boundary
  addCountryBorder(map, countryIso);
  // Add a new layer to highlight the specific country
  highlightCountry(map, countryIso);

  zoomToLayerWithAdjustment(map, countryIso);
};

const removeCountryLayers = (countryIso: string) => {
  const map = mapRef.value;
  if (!map) return;

  map.removeLayer(getCountryBorderLayerName(countryIso));
  map.removeLayer(getCountryLayerName(countryIso));
};

defineExpose({
  zoomInCountry,
  removeCountryLayers,
});
</script>
