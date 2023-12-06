import React, { useState } from 'react';
import { treemap, hierarchy, scaleOrdinal, scaleLinear, schemeDark2, mean, group } from "d3";
import privateIcon from '../icons/PrivateRoomIcon.png';
import entireIcon from '../icons/EntireHomeIcon.png';
import sharedIcon from '../icons/SharedRoomIcon.png';
import hotelIcon from '../icons/HotelRoomIcon.png';


export function processData(data, selectedRegion) {
  const boroughList = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

  // Filter data based on selectedRegion
  let filteredData;
  if (boroughList.includes(selectedRegion)) {
    filteredData = data.filter(listing => listing.neighbourhood_group === selectedRegion);
  } else if (selectedRegion == null) {
    filteredData = data; // If no region is selected, use all data
  } else {
    filteredData = data.filter(listing => listing.neighbourhood === selectedRegion);
  }

  // Group the filtered data
  const groupedData = group(filteredData, d => d.neighbourhood, d => d.room_type);

  // Structure the grouped data for the treemap
  const rootData = {
    name: 'NYC',
    children: Array.from(groupedData, ([neighbourhood, roomTypes]) => ({
      name: neighbourhood,
      children: Array.from(roomTypes, ([roomType, listings]) => {
        // Calculate aggregated data for each room type
        const totalListings = listings.length;
        const totalPrice = listings.reduce((acc, listing) => acc + parseInt(listing.price), 0);
        const averagePrice = totalListings > 0 ? totalPrice / totalListings : 0;

        return {
          name: roomType,
          value: totalListings,
          averagePrice: averagePrice
        };
      })
    }))
  };

  // Enhance the hierarchical structure with additional data
  const root = hierarchy(rootData).sum(d => d.value ? d.value : 0)  // Use sum to calculate the aggregated value
    .eachAfter(node => {
      if (node.children) {
        const leafNodes = node.leaves();
        node.size = leafNodes.length;
        node.averagePrice = mean(leafNodes, d => d.data.averagePrice);
      }
    });

  console.log(root)
  return root;
}

export function createColorScale(root) {
  // Extract pricing from the hierarchical data
  const pricing = root.leaves().map(leaf => leaf.data.averagePrice);
  const minPrice = Math.min(...pricing);
  // max pricing doesn't make sense
  // const maxPrice = Math.max(...pricing);
  const maxPrice = Math.min(20000, Math.max(...pricing));

  const colorScale = scaleLinear()
    .domain([minPrice, maxPrice])
    .range(['#ffcccc', '#ff0000']); // Light red to dark red

  return colorScale;
}


export function TreeMapComponent({ data, width = 800, height = 600, selectedRegion }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const icons = {
    'Private room': privateIcon,
    'Entire home/apt': entireIcon,
    'Shared room': sharedIcon,
    'Hotel room': hotelIcon
  };

  const hierarchicalData = processData(data, selectedRegion);
  const colorScale = createColorScale(hierarchicalData);

  const root = treemap().size([width, height]).padding(0.5).round(true)(hierarchicalData)
    .sort((a, b) => b.value - a.value);
  const leaves = root.leaves();

  return (
    <svg width={width} height={height}>
      {leaves.map((leaf, idx) => {
        const iconSize = Math.min(leaf.x1 - leaf.x0, leaf.y1 - leaf.y0) / 2;

        return (
          <g key={idx} transform={`translate(${leaf.x0}, ${leaf.y0})`}>
            <rect
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              fill={colorScale(leaf.data.averagePrice)}
              onMouseEnter={() => setHoveredItem(leaf)}
              onMouseLeave={() => setHoveredItem(null)}
            />
            <image
              href={icons[leaf.data.name]}
              x={(leaf.x1 - leaf.x0) / 2 - iconSize / 2}
              y={(leaf.y1 - leaf.y0) / 2 - iconSize / 2}
              height={iconSize}
              width={iconSize}
            />
          </g>
        );
      })}

      {hoveredItem && (
        <foreignObject
          x={hoveredItem.x0}
          y={hoveredItem.y0}
          width={200}
          height={100}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}>
            <strong>{hoveredItem.data.name}</strong>
            <div>Average Price: {hoveredItem.data.averagePrice}</div>
            {/* Include other information you want to display */}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}