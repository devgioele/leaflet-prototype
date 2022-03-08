import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, GeoJSON, Polygon } from 'react-leaflet';
import {
  Layer,
  StyleFunction,
  GeoJSON as LeafletGeoJSON,
  Polyline,
  Map as LeafletMap,
} from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { useRef } from 'react';
import usStates from 'constants/usStates';

// See Leaflet's example: https://leafletjs.com/examples/choropleth

const getColor = (d: number) => {
  if (d > 1000) {
    return '#800026';
  }
  if (d > 500) {
    return '#BD0026';
  }
  if (d > 200) {
    return '#E31A1C';
  }
  if (d > 100) {
    return '#FC4E2A';
  }
  if (d > 50) {
    return '#FD8D3C';
  }
  if (d > 20) {
    return '#FEB24C';
  }
  if (d > 10) {
    return '#FED976';
  }
  return '#FFEDA0';
};

export default function Map() {
  const mapRef = useRef<LeafletMap>();
  const geoJsonRef = useRef<LeafletGeoJSON>(null);
  const highlightedRef = useRef<Polyline>();

  const style: StyleFunction = (feature) => ({
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature?.properties.density),
  });

  const zoomToFeature = (feature: Polyline) =>
    mapRef.current?.fitBounds(feature.getBounds());

  const highlightFeature = (feature: Polyline) => {
    feature.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    feature.bringToFront();
    zoomToFeature(feature);
  };

  const removeHighlight = (feature: Polyline) => {
    geoJsonRef.current?.resetStyle(feature);
  };

  const toggleHighlight = (e: any) => {
    // If a new feature has been clicked
    if (e.target !== highlightedRef.current) {
      // Remove highlight from previous feature, if any
      if (highlightedRef.current) {
        removeHighlight(highlightedRef.current);
      }
      // Highlight new feature
      highlightFeature(e.target);
      highlightedRef.current = e.target;
    }
  };

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    layer.on({
      click: toggleHighlight,
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <MapContainer
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        center={[45, -96]}
        zoom={3}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={[
            [51.49, -0.09],
            [51.52, -0.08],
            [51.48, -0.04],
          ]}
        />
        <GeoJSON
          ref={geoJsonRef}
          data={usStates}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
