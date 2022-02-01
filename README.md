# React with Leaflet

ArcGIS is a popular solution to hosting maps. The [ArcGIS API for Javascript](https://developers.arcgis.com/javascript) is pretty slow when multiple [FeatureLayers](https://doc.arcgis.com/en/arcgis-online/reference/feature-layers.htm) are shown concurrently.

This project aims to use [Leaflet](https://leafletjs.com), a FOSS alternative, to implement various features possible with ArcGIS.

The current features are of interest:
- Use a custom map
- Show polygons contained by a [shapefile](https://en.wikipedia.org/wiki/Shapefile)
- Choose color of each polygon based on its properties in the shapefile
- Highlight a polygon
- Move the map such that a specific polygon is on a certain posisition on the screen (e.g. in the upper left corner)
- Show a loading indicator
- Show a custom legend