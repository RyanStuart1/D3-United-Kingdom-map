var svg; 
var projection;
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "8px")
    .style("margin", "0px")
    .style("border", "2px", "solid aqua")
    .style("border-radius", "8px")
    .style("color", "aqua")
    .style("background-color", "grey")
    .style("pointer-events", "none")
    .style("z-index", 100)

function d3Draw(dataset){
    height = 1000;
    width = 1000;
    var scalefactor = 0.01;

    // I used https://stackoverflow.com/questions/42055874/switching-projection-to-d3-geomercator-causes-errors to help create var projection
    projection = d3.geoMercator()
        .center([-4, 55])
        .scale(2590)
        .translate([width / 2, height / 2]); 
        
    if (!svg){
        svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("top", 100)
        .style("centre", 0)
        .style("z-index", 10)
        .style("position", "absolute")
    } 

/* I used https://stackoverflow.com/questions/33899497/projectionlat-lng-keeps-returning-null
to help return both longitude and latitude */

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", ".tooltip")
        .attr("cx", function(d){
            return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function(d){
            return projection([d.lng, d.lat])[1];
        })
        .attr("r", function(d){
            return Math.sqrt(d.Population) * scalefactor;
        })
        .attr("fill", "#f9098f")
        .style("stroke","black")
        .style("stroke-width", 2);

    attachEventListeners();
}

function d3Update(dataset){
    var scalefactor = 0.01;

    var town_circles = svg.selectAll("circle")
        .data(dataset, function(d){
            return d.id;
        });

    town_circles.transition()
        .duration(0)
        .attr("cx", function(d){ 
            return projection([d.lng, d.lat])[0]; })
        .attr("cy", function(d){ 
            return projection([d.lng, d.lat])[1]; })
        .attr("r", function(d){ 
            return Math.sqrt(d.Population) * scalefactor; 
        });

    town_circles.enter()
        .append("circle")
        .attr("cx", function(d){
            return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function(d){
            return projection([d.lng, d.lat])[1];
        })
        .attr("r", function(d){
            return Math.sqrt(d.Population) * scalefactor;
        })
        .attr("fill", "#f9098f")
        .style("stroke","black")
        .style("stroke-width", 2.5)

    town_circles.exit()
        .transition()
        .duration(1000)
        .remove()
        .attr("r", 0); // Reduce radius to 0 
     
    attachEventListeners();
}
 
/* source: https://d3-graph-gallery.com/graph/scatter_tooltip.html
   source: https://d3-graph-gallery.com/graph/interactivity_tooltip.html
   source: CHATGPT: helped integrate function attachEventListeners
*/   
function attachEventListeners(){
    svg.selectAll("circle")
        .style("pointer-events", "all")
        .on("mouseover", function (event, d){
            console.log(d.Town); // debug logging
            d3.select(".tooltip")
                .transition()
                .duration(100)
                .style("opacity", 1)
                .html(`
                    <strong>Town:</strong> ${event.Town}<br>
                    <strong>County:</strong> ${event.County}<br>
                    <strong>Population:</strong> ${event.Population}`);
        })
        .on("mousemove", function(event){
            d3.select(".tooltip")
                .style("left", `${d3.mouse(this)[0] + 800}` + "px")
                .style("top", `${d3.mouse(this)[1] + 100}` + "px")  
                .html(`<strong>Town:</strong> ${event.Town}<br>
                       <strong>County:</strong> ${event.County}<br>
                       <strong>Population:</strong> ${event.Population}`);
        })
        .on("mouseout", function(){
            d3.select(".tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
}

// source: https://stackoverflow.com/questions/55940670/how-to-get-slider-range-value-and-store-it-in-a-variable-within-javascript
function loadData(){
    var slider = document.getElementById("myRange");
    var sliderValueDisplay = document.getElementById("slider-value");
    sliderValueDisplay.textContent = slider.value;

    updateData();

    d3.select(".update-dataset")
    .on("click", function(){
        sliderValueDisplay.textContent = slider.value;
        updateData();
    }, {passive: true});
}

// source: https://stackoverflow.com/questions/55940670/how-to-get-slider-range-value-and-store-it-in-a-variable-within-javascript
function updateData(){   
    var sliderValue = document.getElementById("myRange").value;
    document.getElementById("slider-value").textContent = sliderValue;
    var url = `http://34.147.162.172/Circles/Towns/${sliderValue}`;

    d3.json(url, function(error, data){
        if (error){
            console.log(error);
        } else {
            if (!svg){
                d3Draw(data);
            } else {
                d3Update(data);
            }
        }
    });
}

window.onload= loadData;