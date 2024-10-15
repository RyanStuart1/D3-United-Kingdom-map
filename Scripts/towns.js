//http://34.147.162.172/Circles/Towns/50


var svg;
function d3Draw(dataset){
height = 800;
width = 650;

if ((typeof svg == "undefined")){
    svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("top", 82)
    .style("centre", 0)
    .style("z-index", 10)
    .style("pointer-events", "none")
    .style("position", "absolute");
} else {

}

var town_circles = svg.selectAll("circle")
.data(dataset)
.enter()
.append("circle");

town_circles.attr("clng", function(d){
    return d.lng;
})
.attr("clat", function(d){
    return d.lat;
})
.attr("cpop", function(d){
    return d.pop;
});
}

function d3Update(dataset){
    var town_circles = svg.selectAll("circle")
    .data(dataset)
    .transition()
    .duration(1800)
    .ease(d3.easeElastic);

    town_circles.attr("clng", function(d){
        return d.lng;
    })
    .attr("clat", function(d){
        return d.lat;
    })
    .attr("cpop", function(d){
        return d.pop;
});
}

function loadData(){

    d3.select("button")
    .on("click", function(){

            updateData();
    });
    d3.json("http://34.147.162.172/Circles/Towns/10",function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Draw(data);
        }
    }
    );   
}

function updateData(){

    d3.json("http://34.147.162.172/Circles/Towns/10", function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Update(data);
        }
    }
    );
}

window.onload= loadData;