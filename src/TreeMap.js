import React, { useMemo } from 'react';
import { hierarchy, treemap, scaleSequential, interpolateCool, group, max, mean } from 'd3';

function Treemap({ listings }) {
  const root = useMemo(() => {
    const groupedByRoomType = group(listings, d => d.room_type);
    const groupedByNeighbourhood = new Map();

    groupedByRoomType.forEach((values, roomType) => {
      groupedByNeighbourhood.set(roomType, group(values, d => d.neighbourhood));
    });

    const hierarchyData = hierarchy({
      values: Array.from(groupedByNeighbourhood, ([roomType, neighbourhoods]) => ({
        name: roomType,
        values: Array.from(neighbourhoods, ([neighbourhood, listings]) => ({
          name: neighbourhood,
          values: listings.map(listing => ({
            ...listing,
            value: 1 // Assign a value of 1 for each listing for size encoding
          }))
        }))
      }))
    }, d => d.values).sum(d => d.value); // Aggregate the count for size encoding

    return treemap()
      .size([800, 600])
      .padding(1)
      (hierarchyData.sum(d => d.value)); // Apply the treemap layout
  }, [listings]);

  const color = scaleSequential(interpolateCool)
    .domain([0, max(listings, d => d.price)]);

  return (
    <svg width={800} height={600} className="treemap">
      {root.leaves().map((leaf, index) => {
        const meanPrice = leaf.data.values
          ? mean(leaf.data.values, d => parseFloat(d.price))
          : 0;

        return (
          <rect
            key={`${leaf.data.id}`}
            x={leaf.x0}
            y={leaf.y0}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            style={{
              fill: color(meanPrice)
            }}
          />
        )
      })}
    </svg>
  );
}

export { Treemap };
