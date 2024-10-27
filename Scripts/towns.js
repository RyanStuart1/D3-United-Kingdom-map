//http://34.147.162.172/Circles/Towns/50

var svg; 
var projection;

function d3Draw(dataset){
height = 1000;
width = 1000;

/* I used https://stackoverflow.com/questions/42055874/switching-projection-to-d3-geomercator-causes-errors 
to help create var projection */

    const scalefactor = 0.01;

    projection = d3.geoMercator()
        .center([-4, 55])
        .scale(2590)
        .translate([width / 2, height / 2]);

    if ((typeof svg == "undefined")){
        svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("top", 100)
        .style("centre", 0)
        .style("z-index", 10)
        .style("pointer-events", "none")
        .style("position", "absolute");
    } else {

    }

/* I used https://stackoverflow.com/questions/33899497/projectionlat-lng-keeps-returning-null
to help return both longitude and latitude */

    const town_circles = svg.selectAll("circle")
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
        .style("stroke-width", 2);
}

function d3Update(dataset){
    const scalefactor = 0.01;

    const town_circles = svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(2500)
        .ease(d3.easeElastic)

        town_circles.attr("cx", function(d){
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
}

function loadData(){

    d3.select("button")
    .on("click", function(){
        updateData();
    });
    d3.json("http://34.147.162.172/Circles/Towns/500",function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Draw(data);
        }
    });   
}

function updateData(){

    d3.json("http://34.147.162.172/Circles/Towns/500", function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Update(data);
        }
    });
}

window.onload= loadData;