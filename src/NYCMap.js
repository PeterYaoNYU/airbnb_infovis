import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ apikey, listings, selectedRegion, regionGeoJSON }) => {
  const googleMapRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);

  // console.log(listings)

  const nyuCoordinates = { lat: 40.7291, lng: -73.9965 };

  useEffect(() => {
    async function loadGoogleMaps() {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apikey}&libraries=places&language=en`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      document.body.appendChild(googleMapScript);

      return new Promise((resolve) => {
        googleMapScript.addEventListener('load', resolve);
      });
    }

    loadGoogleMaps().then(() => {
      const map = new window.google.maps.Map(googleMapRef.current, {
        zoom: 13,
        center: { lat: 40.7291, lng: -73.9965 },
        disableDefaultUI: false,
        zoomControl: true,
      });
      setGoogleMap(map);
    });
  }, [apikey]);


  useEffect(() => {
    async function handleListings() {
      if (googleMap && listings) {
        // Create an InfoWindow instance inside the useEffect hook
        const infoWindow = new window.google.maps.InfoWindow({ disableAutoPan: true, });

        listings.forEach(listing => {
          let color = listing.room_type === 'Private room' ? '#00FF00' : '#FF0000';
          const circle = new window.google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map: googleMap,
            // this brings the circle to the front of all the other layers, include the polygons, and ensures interactivity. 
            zIndex: google.maps.Marker.MAX_ZINDEX + 10,
            center: { lat: listing.latitude, lng: listing.longitude },
            radius: 10,
          });

          const contentString = `
          <div>
            <h3>${listing.name}</h3>
            <h5><strong>Price:</strong> $${listing.price}/night</h5>
            <p><strong>Minimum nights:</strong> ${listing.minimum_nights}</p>
            <p><strong>Number of reviews:</strong> ${listing.number_of_reviews}</p>
          </div>
        `;

          circle.addListener('mouseover', () => {
            infoWindow.setContent(contentString);
            // infoWindow.setPosition(circle.getCenter());
            infoWindow.setPosition({ lat: listing.latitude, lng: listing.longitude });
            infoWindow.open(googleMap);

            const bounds = googleMap.getBounds();
            // console.log(bounds);
            if (bounds) {
              // Calculate the pixel location of the circle
              const circlePos = circle.getCenter();
              const circlePosPx = googleMap.getProjection().fromLatLngToPoint(circlePos);

              // Define the pixel size of the InfoWindow (you might need to adjust this)
              const IW_WIDTH_PX = 200;
              const IW_HEIGHT_PX = 200;

              // Calculate the pixel bounds of the map
              const mapNE = bounds.getNorthEast();
              const mapSW = bounds.getSouthWest();
              const mapNEPx = googleMap.getProjection().fromLatLngToPoint(mapNE);
              const mapSWPx = googleMap.getProjection().fromLatLngToPoint(mapSW);

              // Calculate if the InfoWindow will be out of bounds
              const IWOffsetX = circlePosPx.x + IW_WIDTH_PX * (1 / Math.pow(2, googleMap.getZoom()));
              const IWOffsetY = circlePosPx.y - IW_HEIGHT_PX * (1 / Math.pow(2, googleMap.getZoom()));

              // Create a new bounds object to potentially pan to
              let newBounds = bounds;

              // Check if the InfoWindow goes out of the current bounds and adjust if necessary
              if (IWOffsetX > mapNEPx.x || IWOffsetY < mapNEPx.y) {
                // Convert the modified pixel points back to LatLng
                const newNE = googleMap.getProjection().fromPointToLatLng(new google.maps.Point(IWOffsetX, IWOffsetY));
                // Extend the bounds to include the new point
                newBounds = newBounds.extend(newNE);
                // Pan the map to the new bounds
                googleMap.panToBounds(newBounds);
              }
            }
          });

          circle.addListener('mouseout', () => {
            infoWindow.close();
          });
        });
      }
    }
    handleListings();
  }, [googleMap, listings]);

  // Load the GeoJSON data
  useEffect(() => {
    async function loadGeoJSON() {
      if (googleMap && regionGeoJSON) {
        googleMap.data.addGeoJson(regionGeoJSON);

        googleMap.data.setStyle({
          strokeWeight: 2,
          strokeColor: '#000000', // Set the border color to black or any other color
          fillOpacity: 0, // Make the fill transparent
          zIndex: -1 //to the bottom!
        });
      }
    }
  }, [googleMap, regionGeoJSON]);



  // useEffect(() => {
  //   if (googleMap && selectedRegion && regionGeoJSON) {
  //     // Find the feature in the GeoJSON that matches the selected region
  //     const feature = regionGeoJSON.features.find(
  //       f => f.properties.neighbourhood === selectedRegion
  //     );

  //     if (feature) {
  //       // Define the bounds
  //       const bounds = new window.google.maps.LatLngBounds();

  //       // Process the geometry of the selected feature to extend the bounds
  //       processPoints(feature.geometry, bounds.extend, bounds);

  //       // Fit the map to the bounds
  //       googleMap.fitBounds(bounds);
  //     }
  //   }
  // }, [googleMap, selectedRegion, regionGeoJSON]);

  useEffect(() => {
    async function handleSelectedRegion() {
      if (googleMap && selectedRegion && regionGeoJSON) {
        // Aggregate neighborhoods by borough (neighbourhood_group)
        const boroughGeometries = regionGeoJSON.features
          .filter(f => f.properties.neighbourhood_group === selectedRegion)
          .map(f => f.geometry);

        // Create a LatLngBounds object
        const bounds = new window.google.maps.LatLngBounds();

        // Extend the bounds to include each neighborhood's geometry
        boroughGeometries.forEach(geometry => {
          processPoints(geometry, bounds.extend, bounds);
        });

        // If there are geometries to include, fit the map to the bounds
        if (boroughGeometries.length > 0) {
          googleMap.fitBounds(bounds);
        } else {
          // If no geometries were found, this means the selected region may be a neighborhood
          // Find the feature in the GeoJSON that matches the selected region
          const feature = regionGeoJSON.features.find(
            f => f.properties.neighbourhood === selectedRegion
          );

          if (feature) {
            // Process the geometry of the selected feature to extend the bounds
            processPoints(feature.geometry, bounds.extend, bounds);

            // Fit the map to the bounds
            googleMap.fitBounds(bounds);
          }
        }
      }
    }
    handleSelectedRegion();
  }, [googleMap, selectedRegion, regionGeoJSON]);



  // Helper function to process geometries and extend bounds
  function processPoints(geometry, callback, thisArg) {
    if (geometry instanceof window.google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry.type === 'Point') {
      const latLng = new window.google.maps.LatLng(geometry.coordinates[1], geometry.coordinates[0]);
      callback.call(thisArg, latLng);
    } else if (geometry.type === 'MultiPoint' || geometry.type === 'LineString') {
      geometry.coordinates.forEach(coord => {
        callback.call(thisArg, new window.google.maps.LatLng(coord[1], coord[0]));
      });
    } else if (geometry.type === 'MultiLineString' || geometry.type === 'Polygon') {
      geometry.coordinates.forEach(path => {
        path.forEach(coord => {
          callback.call(thisArg, new window.google.maps.LatLng(coord[1], coord[0]));
        });
      });
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(polygon => {
        polygon.forEach(path => {
          path.forEach(coord => {
            callback.call(thisArg, new window.google.maps.LatLng(coord[1], coord[0]));
          });
        });
      });
    } else if (geometry.type === 'GeometryCollection') {
      geometry.geometries.forEach(g => {
        processPoints(g, callback, thisArg);
      });
    }
  }

  return (
    <div
      ref={googleMapRef}
      style={{ width: '100%', height: '96vh' }}
    />
  );
};

export { GoogleMap };
