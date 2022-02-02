import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, GeoJSON, Polygon } from 'react-leaflet';
import L, {
  Layer,
  LeafletMouseEventHandlerFn,
  StyleFunction,
  GeoJSON as LeafletGeoJSON,
  Polyline,
} from 'leaflet';
import { Feature, Geometry } from 'geojson';
import { useRef, useState } from 'react';
import usStates from 'constants/usStates';

// See Leaflet's example: https://leafletjs.com/examples/choropleth

type HighlightState = {
  highlighted: boolean;
  target: any | undefined;
};

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
  const geoJsonRef = useRef<LeafletGeoJSON>(null);
  const [highlight, setHighlight] = useState<HighlightState>({
    highlighted: false,
    target: undefined,
  });

  const style: StyleFunction = (feature) => ({
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature?.properties.density),
  });

  const zoomToFeature = (feature: Polyline) =>
    map.fitBounds(feature.getBounds());

  const highlightFeature = (feature: Polyline) => {
    feature.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    // TODO: Examine why some browsers don't work
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      feature.bringToFront();
    }
    zoomToFeature(feature);
  };

  const removeHighlight = (feature: Polyline) => {
    geoJsonRef.current?.resetStyle(feature);
  };

  const toggleHighlight: LeafletMouseEventHandlerFn = (e) => {
    setHighlight((prevHighlight) => {
      if (e.target !== prevHighlight.target) {
        /* If a defined target has been clicked, highlight it,
        otherwise remove the highlight from the prev target
        */
        const newHighlight: HighlightState = {
          highlighted: !!e.target,
          target: e.target,
        };
        if (newHighlight.highlighted) {
          highlightFeature(e.target);
        } else {
          removeHighlight(prevHighlight.target);
        }
        return newHighlight;
      }
      return prevHighlight;
    });
  };

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    layer.on({
      click: toggleHighlight,
    });
  };

  return (
    <div style={{ height: '100%' }}>
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        scrollWheelZoom={false}
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
