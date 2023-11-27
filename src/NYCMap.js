import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ apikey, listings }) => {
  const googleMapRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);

  console.log(listings)

  const nyuCoordinates = { lat: 40.7291, lng: -73.9965 };

  useEffect(() => {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apikey}&libraries=places&language=en`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      const map = new window.google.maps.Map(googleMapRef.current, {
        zoom: 13,
        center: nyuCoordinates,
        disableDefaultUI: false,
        zoomControl: true,
      });
      setGoogleMap(map);
    });
  }, [apikey]);

  useEffect(() => {
    if (googleMap && listings) {
      // Create an InfoWindow instance inside the useEffect hook
      const infoWindow = new window.google.maps.InfoWindow({disableAutoPan: true,});

      listings.forEach(listing => {
        let color = listing.room_type === 'Private room' ? '#00FF00' : '#FF0000';
        const circle = new window.google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          map: googleMap,
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
  }, [googleMap, listings]);

  return (
    <div
      ref={googleMapRef}
      style={{ width: '100%', height: '96vh' }}
    />
  );
};

export { GoogleMap };
