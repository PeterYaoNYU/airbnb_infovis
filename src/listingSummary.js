import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ListingSummary = ({ listings, selectedRegion }) => {
  // Filter listings for the selected region
  let boroughList = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]

  let filteredListings = []

  if (boroughList.includes(selectedRegion)) {
    filteredListings = listings.filter(
        (listing) => listing.neighbourhood_group === selectedRegion
    )
  } else if (selectedRegion == null) {
    filteredListings = listings
  } else { 
    filteredListings = listings.filter(
        (listing) => listing.neighbourhood === selectedRegion
    )
  }
  
  // Calculate the total number of listings
  const totalListings = filteredListings.length;

  // Group listings by room type and count them
  const roomTypeCounts = filteredListings.reduce((acc, listing) => {
    const { room_type } = listing;
    acc[room_type] = (acc[room_type] || 0) + 1;
    return acc;
  }, {});

  // Convert roomTypeCounts to array suitable for bar chart
  const chartData = Object.keys(roomTypeCounts).map(roomType => ({
    name: roomType,
    count: roomTypeCounts[roomType]
  }));

  return (
    <div className="listing-summary">
      <h2>Total Listings: {totalListings}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export {ListingSummary};
