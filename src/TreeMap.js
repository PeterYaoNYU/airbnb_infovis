import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2, mean, group } from "d3";

export function processData(data, selectedRegion) {
  // neighborhood_groups->neighbourhoods->room_types->listings

  // const groupedData = group(data, d => d.neighbourhood_group, d => d.neighbourhood, d => d.room_type);

  // const rootData = {
  //   name: 'NYC',
  //   children: Array.from(groupedData, ([neighbourhoodGroup, neighbourhoods]) => ({
  //     name: neighbourhoodGroup,
  //     children: Array.from(neighbourhoods, ([neighbourhood, roomTypes]) => ({
  //       name: neighbourhood,
  //       children: Array.from(roomTypes, ([roomType, listings]) => ({
  //         name: roomType,
  //         children: listings.map(listing => ({ name: listing.name, value: listing.price }))
  //       }))
  //     }))
  //   }))
  // };

  // neighborhood_groups->room_types->listings

  // const groupedData = group(data, d => d.neighbourhood_group, d => d.room_type);

  // const rootData = {
  //   name: 'NYC',
  //   children: Array.from(groupedData, ([neighbourhoodGroup, roomTypes]) => ({
  //     name: neighbourhoodGroup,
  //     children: Array.from(roomTypes, ([roomType, listings]) => ({
  //       name: roomType,
  //       children: listings.map(listing => ({ name: listing.name, value: listing.price }))
  //     }))
  //   }))
  // };

  // neighborhood_groups->neighbourhoods->listings

  // const groupedData = group(data, d => d.neighbourhood_group, d => d.neighbourhood)
  // const rootData = {
  //   name: 'NYC',
  //   children: Array.from(groupedData, ([neighbourhoodGroup, neighbourhoods]) => ({
  //     name: neighbourhoodGroup,
  //     children: Array.from(neighbourhoods, ([neighbourhood, listings]) => ({
  //       name: neighbourhood,
  //       children: listings.map(listing => ({ name: listing.name, value: listing.price }))
  //     }))
  //   }))
  // };
  // selectedRegion


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
  const groupedData = group(filteredData, d => d.neighbourhood_group, d => d.room_type);

  // Structure the grouped data for the treemap
  const rootData = {
    name: 'NYC',
    children: Array.from(groupedData, ([neighbourhoodGroup, roomTypes]) => ({
      name: neighbourhoodGroup,
      children: Array.from(roomTypes, ([roomType, listings]) => {
        // Calculate aggregated data for each room type
        const totalListings = listings.length;
        const totalPrice = listings.reduce((acc, listing) => acc + listing.price, 0);
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
        // node.averagePrice = mean(leafNodes, d => d.data.value);
        // console.log(node)
      }
    });

  return root;
}

export function createColorScale(root) {
  // Extract unique categories from the hierarchical data
  const neighborhoodGroups = root.leaves().map(leaf => leaf.ancestors()[1].data.name);
  const uniqueCategories = Array.from(new Set(neighborhoodGroups));
  console.log(uniqueCategories)
  return scaleOrdinal(schemeDark2).domain(uniqueCategories);
}

export function TreeMapComponent({ data, width = 800, height = 600, selectedRegion }) {
  const hierarchicalData = processData(data, selectedRegion);
  const colorScale = createColorScale(hierarchicalData);

  const root = treemap().size([width, height]).padding(0.5).round(true)(hierarchicalData)
    .sort((a, b) => b.value - a.value);
  const leaves = root.leaves();

  return (
    <svg width={width} height={height}>
      {leaves.map((leaf, idx) => (
        <g key={idx} transform={`translate(${leaf.x0}, ${leaf.y0})`}>
          <rect
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            fill={colorScale(leaf.ancestors()[1].data.name)} // Replace with the appropriate property
          />
          {/* Additional elements like text can be added here */}
        </g>
      ))}
    </svg>
  );
}