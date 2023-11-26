import { geoPath, geoMercator } from "d3-geo"
import React, { useRef, useEffect } from "react";
import {zoom, select, event } from "d3";

function NYCMap(props){
    const { width, height, neighborhoods } = props;
    console.log("width", width, "height", height);
    const svgRef = useRef();

    const gRef = useRef();


    // Setup the projection
    const projection = geoMercator()
        .fitSize([width, height], neighborhoods)
        // .scale(97)
        // .translate([width / 2, height / 2 + 20]);

    // Create a path generator
    const pathGenerator = geoPath().projection(projection);

    console.log("geojso>>>")
    console.log(neighborhoods.features)

    const zoomBehavior = zoom()
        .scaleExtent([1, 8]) // Limits zooming in and out
        .on("zoom", (event) => {
            const { transform } = event;
            select(gRef.current).attr("transform", transform);
        });

    useEffect(() => {
            select(svgRef.current)
                .call(zoomBehavior);
        }, [zoomBehavior]);

    const zoomIn = () => {
        zoomBehavior.scaleBy(select(svgRef.current), 1.2); // 20% zoom in
    };

    const zoomOut = () => {
        zoomBehavior.scaleBy(select(svgRef.current), 0.8); // 20% zoom out
    };

    // // Apply zoom behavior to the SVG
    // useEffect(() => {
    //     select(svgRef.current).call(handleZoom);
    // }, []);
    return (
        <>
            <svg ref={svgRef} width={width} height={height}>
                <g ref={gRef}>
                    {neighborhoods.features.map((feature, i) => (
                        <path
                            key={i}
                            d={pathGenerator(feature)}
                            fill={"#eee"}
                            stroke={"#ccc"}
                            strokeWidth={0.5}
                        />
                    ))}
                </g>
            </svg>
            <div className="zoom-buttons">
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
            </div>
        </>
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