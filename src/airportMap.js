import { geoPath, geoMercator } from "d3-geo"
import React, { useRef, useEffect, useState } from "react";
import {zoom, select, event } from "d3";

function NYCMap(props){
    const { width, height, neighborhoods } = props;
    console.log("width", width, "height", height);
    const svgRef = useRef();

    const gRef = useRef();

    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);


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