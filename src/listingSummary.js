import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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


    // Function to determine bar color based on room_type
    const getBarColor = (roomType) => {
        if (roomType === 'Entire home/apt') return '#FF0000'; // Red color for Entire home/apt
        if (roomType === 'Private room') return '#00FF00'; // Green color for Private room
        return '#8884d8'; // Default color for other types
      };

  // Convert roomTypeCounts to array suitable for bar chart
  const chartData = Object.keys(roomTypeCounts).map(roomType => ({
    name: roomType,
    count: roomTypeCounts[roomType]
  }));

  return (
    <div className="row">
        {/* Total Listings on the left */}
        <div className="col-md-4">
            {/* <h2>Total Listings: {totalListings}</h2> */}
        </div>
        
        {/* Bar Chart on the right */}
        <div className="col-md-8">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                        {
                            chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);
};

export {ListingSummary};
