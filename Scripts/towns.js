//http://34.147.162.172/Circles/Towns/50


var svg d3Draw(dataset){
    Width = 500;
    Height = 1000;
    if ((typeof svf == "undefined")){
        svg = d3.select("body").append("svg")
        .attr("width", Width)
        .attr("Height", Height);
    } else {

    }
    var town_circles = svg.selectAll("town circle")
    .data(dataset)
    .enter()
    .append("town circle");

    town_circles
}

function d3Update(){
    var town_circles = svg.selectAll("town circle")
    .data(dataset)
    .transition()
    .duration(1800)
    .ease("Elastic");
}

function loadData(){

    d3.select("p")
    .on("click", function(){

            updateData();
    });
    d3.json("http://34.147.162.172/Circles/Towns/500",function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Draw(data);
        }
    }
    );   
}

function updateData(){

    d3.json("http://34.147.162.172/Circles/Towns/500", function(error, data){
        if (error){
            console.log(error)
        }else{
            d3Update(data);
        }
    }
    );
}

windows.onload= loadData;