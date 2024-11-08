//http://34.147.162.172/Circles/Towns/50

var svg; 
var projection;

function d3Draw(dataset){
    height = 1000;
    width = 1000;
    const scalefactor = 0.01;

    projection = d3.geoMercator()
        .center([-4, 55])
        .scale(2590)
        .translate([width / 2, height / 2]); // I used https://stackoverflow.com/questions/42055874/switching-projection-to-d3-geomercator-causes-errors to help create var projection
        

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
        .style("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(".tooltiptext")
                .transition()
                .duration(200)
                .style("opacity", 1) 
                .text(`Town: ${d.Town}, County: ${d.County}, Population: ${d.Population}`); // Set text in tooltip
        })
        .on("mousemove", function(event) {
            d3.select(".tooltip")
                .style("left", (event.pageX + 10) + "px") 
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(".tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
}

function d3Update(dataset){
    const scalefactor = 0.01;

    const town_circles = svg.selectAll("circle")
        .data(dataset, function(d) {
            return d.id;
        });

    town_circles.transition()
        .duration(0)
        //.ease(d3.easeElastic)
        .attr("cx", function(d) { 
            return projection([d.lng, d.lat])[0]; })
        .attr("cy", function(d) { 
            return projection([d.lng, d.lat])[1]; })
        .attr("r", function(d) { 
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
        //.transition()
        //.duration(1000)
        //.ease(d3.easeElastic);

    town_circles.exit()
        .transition()
        .duration(1000)
        .attr("r", 0) // Reduce radius to 0 for smooth removal
        .remove(); // Remove the element from the DOM after transition
}

function loadData(){
    const slider = document.getElementById("myRange");
    const sliderValueDisplay = document.getElementById("slider-value");
    sliderValueDisplay.textContent = slider.value;

    updateData();

    d3.select(".update-dataset")
    .on("click", function(){
        sliderValueDisplay.textContent = slider.value;
        updateData();
    }, {passive: true});
}

function updateData(){   

    let sliderValue = document.getElementById("myRange").value;
    document.getElementById("slider-value").textContent = sliderValue;
    let url = `http://34.147.162.172/Circles/Towns/${sliderValue}`;

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