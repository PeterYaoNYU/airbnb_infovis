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
      const infoWindow = new window.google.maps.InfoWindow();

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
          infoWindow.setPosition(circle.getCenter());
          infoWindow.open(googleMap);
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
