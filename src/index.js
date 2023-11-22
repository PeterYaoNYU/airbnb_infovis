import React from "react";
import ReactDOM from "react-dom";
import { csv, json } from "d3";
import { groupByAirline, groupByAirport } from "./utils";
import "./styles.css";
import { AirportMap } from "./airportMap";
import { BarChart } from "./barChart";
import { AirportBubble} from "./airportBubble";


const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.SourceLatitude = +d.SourceLatitude
                d.SourceLongitude = +d.SourceLongitude
                d.DestLatitude = +d.DestLatitude
                d.DestLongitude = +d.DestLongitude
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        })
    }, []);
    return data;
}


function AirlineRoutes(){
    const [selectedAirline, setSelectedAirline]=React.useState(null);
    const barchart_width = 350;
    const barchart_height = 400;
    const barchart_margin = { top: 10, bottom: 50, left: 130, right: 10 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 600;
    const map_height = 400;
    const hub_width = 400;
    const hub_height = 400;

    const routes = useData(csvUrl);
    const map = useMap(mapUrl);
    
    if (!map || !routes) {
        return <pre>Loading...</pre>;
    };
    let airlines = groupByAirline(routes);
    let airports = groupByAirport(routes);
    // console.log(airlines);
    // console.log(airports);
    // console.log(routes);
    return <div>
        <h1>Airlines Routes</h1>   
        <div className={"mainView"}>
            <div>
                <h2>Airlines</h2>
                <svg id={"barchart"} width={barchart_width} height={barchart_height}>
                    <BarChart offsetX={barchart_margin.left} offsetY={barchart_margin.top} 
                        height={barchart_inner_height} width={barchart_inner_width} data={airlines}
                        selectedAirline={selectedAirline} setSelectedAirline={setSelectedAirline}
                    />
                </svg>
            </div>
            <div>
                <h2>Airports</h2>
                <svg id={"map"} width={map_width} height={map_height}>
                    <AirportMap width={map_width} height={map_height} 
                        countries={map} airports={airports} routes={routes}
                        selectedAirline={selectedAirline}
                    />
                </svg>
            </div>
            <div>
                <h2>The Hubs</h2>
                <svg id={"bubble"} width={hub_width} height={hub_height}>
                    <AirportBubble width={hub_width} height={hub_height} 
                        countries={map}  routes={routes}
                        selectedAirline={selectedAirline}
                    />
                </svg>

            </div>
            
        </div>
    </div>
}

ReactDOM.render(<AirlineRoutes/ >, document.getElementById("root"));