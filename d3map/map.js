// Define the dimensions of your map
const width = 800;
const height = 600;

// Create an SVG container
const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1000);

const path = d3.geoPath().projection(projection);

// Load and parse the GeoJSON data
d3.json("usa.json").then(function (us) {// ... (previous code)

    const bubbleTooltip = d3.select("body").append("div")
    .attr("class", "bubble-tooltip")
    .style("opacity", 0);

    // Create a tooltip for displaying state names
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function updateTooltipPosition(event) {
        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    }
    
    // Bind data and create path elements
    svg.selectAll("path")
    .data(us.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "black")
    .attr("fill", "lightblue")
    .on("mouseover", function (event, d) {
        // Show the state name on hover
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip.html(d.properties.NAME) // Replace with the correct property name
        updateTooltipPosition(event); // Update tooltip position
        // Change the fill color to orange on hover
        d3.select(this)
            .attr("fill", "orange");
    })
    .on("mousemove", function (event) {
        // Update tooltip position while moving the mouse
        updateTooltipPosition(event);
    })
    .on("mouseout", function (d) {
        // Hide the tooltip and reset the fill color on mouseout
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        d3.select(this)
            .attr("fill", "lightblue");
    })
    .append('g');


    d3.json("cities.json").then(function (bubbleData) {
        // Create circles for each bubble location
        svg.selectAll("MyCircle")
            .data(bubbleData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                // Use projection to convert latitude and longitude to SVG coordinates
                return projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function (d) {
                return projection([d.longitude, d.latitude])[1];
            })
            // .attr("r",14)
            .attr("r", function (d) {
                // Set the radius of the bubble based on a data attribute (e.g., population)
                return (d.population/200000) ;
            })
            .attr("class","circle")
            .attr("fill", "rgba(255, 0, 0, 0.7)") // Adjust bubble fill color
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
            // Show the state name on hover
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(d.city) // Replace with the correct property name
                updateTooltipPosition(event); // Update tooltip position
            })
            .on("mousemove", function (event) {
                updateTooltipPosition(event);
            })
            .on("mouseout", function () {
                // Hide the tooltip on mouseout
                bubbleTooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .append('g')
    }); 
});
function zoomed(event) {
    // Update the map and bubble positions on zoom
    d3.select('svg')
        .call(zoom)
    svg.attr("transform", event.transform);
}

const zoom = d3.zoom()
    .on("zoom", zoomed);

zoomed();


list = [ '1','2','3']