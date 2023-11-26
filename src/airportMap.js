import { geoPath, geoMercator } from "d3-geo"
import React, { useRef, useEffect } from "react";
import {zoom, select, event } from "d3";

function NYCMap(props){
    const { width, height, neighborhoods } = props;
    console.log("width", width, "height", height);
    const svgRef = useRef();

    // Setup the projection
    const projection = geoMercator()
        .fitSize([width, height], neighborhoods)
        // .scale(97)
        // .translate([width / 2, height / 2 + 20]);

    // Create a path generator
    const pathGenerator = geoPath().projection(projection);

    console.log("geojso>>>")
    console.log(neighborhoods.features)

    // // Define zoom behavior
    // const handleZoom = zoom()
    //     .scaleExtent([1, 8])
    //     .on("zoom", (e) => {
    //         select(svgRef.current).selectAll('path').attr('transform', e.transform);
    //     });

    // // Apply zoom behavior to the SVG
    // useEffect(() => {
    //     select(svgRef.current).call(handleZoom);
    // }, []);

    return (
            <g>
                {
                    neighborhoods.features.map(feature => {
                        const neighborhood_name = feature.properties.neighbourhood;
                        console.log(neighborhood_name)
                        const neighborhood_group = feature.properties.neighbourhood_group;
                        return (
                            <path
                                key={neighborhood_name}
                                d={pathGenerator(feature)}
                                fill={"#eee"}
                                stroke={"#ccc"}
                                strokeWidth={0.5}
                                onMouseOver={e => {
                                    e.target.style.fill = "#2a5599";
                                }}
                                onMouseOut={e => {
                                    e.target.style.fill = "#eee";
                                }}
                            />
                        );
                    }
                    )
                }
                {/* Add other SVG elements like circles for listings here */}
            </g>
    );
}

export { NYCMap };



// function AirportMap(props){
//     const {width, height, neighborhoods} = props;
//     let projection = geoMercator();//TODO: Create a projection of type Mercator.
//     projection.scale(97)
//             .translate([width / 2, height / 2 + 20]);
//     let path = geoPath().projection(projection);
//     return <g>
//         {
//             neighborhoods.features.map(d => <path key={d.properties.name} d={path(d)} 
//             stroke={"#ccc"} fill={"#eee"}></path>)
//         }
//         {/* {
//             airports.map(d => <circle key={d.AirportID} cx={projection([d.Longitude, d.Latitude])[0]}
//                     cy={projection([d.Longitude, d.Latitude])[1]} r={1} fill={"#2a5599"}></circle>)
//         } */}
//         {/* <Routes projection={projection} routes={routes} selectedAirline={selectedAirline}/> */}
//     </g>


// }

// export { AirportMap }