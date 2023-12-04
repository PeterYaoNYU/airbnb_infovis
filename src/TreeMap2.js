import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2, mean, group } from "d3";

export function processData(data) {
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

//   const groupedData = group(data, d => d.neighbourhood_group, d => d.room_type);

//   const rootData = {
//     name: 'NYC',
//     children: Array.from(groupedData, ([neighbourhoodGroup, roomTypes]) => ({
//       name: neighbourhoodGroup,
//       children: Array.from(roomTypes, ([roomType, listings]) => ({
//         name: roomType,
//         children: listings.map(listing => ({ name: listing.name, value: listing.price }))
//       }))
//     }))
//   };


//   // Enhance the hierarchical structure with additional data
//   const root = hierarchy(rootData).sum(d => d.value ? d.value : 0)  // Use sum to calculate the aggregated value
//     .eachAfter(node => {
//       if (node.children) {
//         const leafNodes = node.leaves();
//         node.size = leafNodes.length;
//         node.averagePrice = mean(leafNodes, d => d.data.value);
//         // console.log(node)
//       }
//     });

//   return root;
// }

  // neighborhood_groups->neighbourhoods->listings

const groupedData = group(data, d => d.neighbourhood_group, d => d.neighbourhood)
const rootData = {
  name: 'NYC',
  children: Array.from(groupedData, ([neighbourhoodGroup, neighbourhoods]) => ({
    name: neighbourhoodGroup,
    children: Array.from(neighbourhoods, ([neighbourhood, listings]) => ({
      name: neighbourhood,
      children: listings.map(listing => ({ name: listing.name, value: listing.price }))
    }))
  }))
};


// Enhance the hierarchical structure with additional data
const root = hierarchy(rootData).sum(d => d.value ? d.value : 0)  // Use sum to calculate the aggregated value
  .eachAfter(node => {
    if (node.children) {
      const leafNodes = node.leaves();
      node.size = leafNodes.length;
      node.averagePrice = mean(leafNodes, d => d.data.value);
      // console.log(node)
    }
  });

return root;
}

export function createColorScale(root) {
  // Extract unique categories from the hierarchical data
  const neighborhoodGroups = root.leaves().map(leaf => leaf.ancestors()[2].data.name);
  const uniqueCategories = Array.from(new Set(neighborhoodGroups));
  console.log(uniqueCategories)
  return scaleOrdinal(schemeDark2).domain(uniqueCategories);
}

export function TreeMapComponent({ data, width = 800, height = 600 }) {
  const hierarchicalData = processData(data);
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
            fill={colorScale(leaf.ancestors()[2].data.name)} // Replace with the appropriate property
          />
          {/* Additional elements like text can be added here */}
        </g>
      ))}
    </svg>
  );
}