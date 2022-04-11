// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

const svg2 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

//container for barchart
const svg3 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

//container for scatter plot
const svg1 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 
//tooltip for hovering

let tooltip = d3.select("#vis-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

let mouseover = function(event, d) {
    d3.select(this).transition()
        .duration('100')
        .attr("r", 10);
        tooltip
        .style("opacity", 1);
  }

let mousemove = function(event, d) {
    tooltip
    .html("City: " + d.city + "<br/>" + column + ": "+ d.rating + "<br/>Overall Rating: " 
        + d.overall)
    .style("left", event.pageX + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", event.pageY + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
let mouseleave = function(event, d) {
    d3.select(this).transition()
        .attr("r", 8)
        .duration(100);
        tooltip.style("opacity", 0);
  }
 
let x1;
let y1;
let myBars;
let myCircles;
let column = "Macroeconomic Overall";

const color = d3.scaleOrdinal()
                    .domain(["Macroeconomic Overall", "Recreational Overall","Residential Overall"])
                    .range([ "#21908dff",  "#8d68b3",  "#cf4851"]);



d3.csv("data/New_Cleaned_CityLife.csv").then((consdata) => {


    var data = consdata.filter(function(d) 
    { 
        if( d["UA_Continent"] == "North America")
        { 
            return d;
        } 
    });

    const overallScore = data.map(function(d) { return d["Overall Rating"] });
    let cities = data.map(function(d) { return d["UA_Name"] });
    let input = data.map(function(d) { return d[column] });

    let cityCostOfLiving = [
    {city: cities, overall: overallScore, rating:input}];
    console.log(cityCostOfLiving);
    let scatterData = [];

    for (let i = 0; i < cities.length; i++) {
        scatterData.push({city : cities[i], overall:overallScore[i], rating:input[i]})
    }


//world map
//reference:
//https://mappingwithd3.com/getting-started/
//json file created from:
//https://geojson-maps.ash.ms/

d3.json('data/map.geo.json').then(function(bb) {
  let mapWidth = width - margin.left - margin.right;
  let mapHeight = height - margin.top - margin.bottom;
  let projection = d3.geoEqualEarth();
  projection.fitSize([mapWidth, mapHeight], bb);
  let geoGenerator = d3.geoPath()
  .projection(projection);

  svg2.append('g').selectAll('path')
  .data(bb.features)
  .join('path')
  .attr('d', geoGenerator)
  .attr('fill', '#088')
  .attr('stroke', '#000');
});

//bar chart

//average each attribute in category across continent - AvgRating
//plot bar chart: x-axis -> category for continent, y-axis -> AvgRating

{

    //const attributes = ["Cost of Living", "Housing", "Healthcare", "Leisure & Culture"];

    //sample continent selection
    //reference:
    //https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns

    


const costOfLiving = data.map(function(d) { return d["Cost of Living"] });
const macro = data.map(function(d) { return d["Macroeconomic Overall"] });
const healthcare = data.map(function(d) { return d["Healthcare"] });
const leisureCulture = data.map(function(d) { return d["Leisure & Culture"] });
const recreational = data.map(function(d) { return d["Recreational Overall"] });
const safety = data.map(function(d) { return d["Safety"] });
const enivironment = data.map(function(d) { return d["Environmental Quality"] });
const residential = data.map(function(d) { return d["Residential Overall"] });


/*
    const avgRatings = [(d3.mean(costOfLiving)),
    (d3.mean(housing)),
    (d3.mean(healthcare)),
    (d3.mean(leisureCulture))];
    */

    const avgRatings = [
    //{attr : "Cost of Living", rating:(d3.mean(costOfLiving))},
    {attr : "Macroeconomic Overall", rating:(d3.mean(macro))},
    {attr : "Recreational Overall", rating:(d3.mean(recreational))},
   // {attr : "Safety", rating:(d3.mean(safety))},
    //{attr : "Environmental Quality", rating:(d3.mean(enivironment))},
    {attr : "Residential Overall", rating:(d3.mean(residential))}
    //{attr : "Healthcare", rating:(d3.mean(healthcare))},
    //{attr : "Leisure & Culture", rating:(d3.mean(leisureCulture))}
    ];



// Create X scale
    let x3 = d3.scaleBand()
            .domain(d3.range(avgRatings.length))
            .range([margin.left, width - margin.right])
            .padding(0.1); 
    
    // Add x axis 
    svg3.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x3)   
          .tickFormat(i => avgRatings[i].attr))
        .attr("font-size", '20px');

    // Find max y (50)
    let maxY3 = d3.max(avgRatings, function(d) { return d.rating; });

    // Create Y scale
    let y3 = d3.scaleLinear()
                .domain([0, maxY3])
                .range([height - margin.bottom, margin.top]); 

    // Add y axis 
    svg3.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(y3)) 
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0-margin.left)
                    .attr("x", 0- (height/2)+20)
                    .attr("dy", "7em")
                    .attr('fill', 'black')
                    .style("text-anchor", "middle")
                    .text("Attribute Rating")
      ); 

        /*
let column = ""
let click = function(event, d) {
    console.log(d3.select(this).attr("x")['label']);

  }
  */
  
        

    // Add points
    myBars = svg3.selectAll("bar")
                            .data(avgRatings)
                            .enter()
                              .append("rect")
                              .attr("x", (d,i) => x3(i))
                              .attr("y", (d) => y3(d.rating))
                              .attr("height", (d) => (height - margin.bottom) - y3(d.rating)) 
                              .attr("width", x3.bandwidth())
                              .style("fill", (d) => color(d.attr))
                              .on("click", updateScatter); 
  }

 

//scatter plot
{
/*
const ratings = (data.map(function(d){ return d[attributes[0]]}))
const overall_score = ["Overall Rating"]
const y_data = (data.map(function(d){ return d.(overall_score[0])}))
*/





// Find max x
   // let maxX1 = d3.max(cityCostOfLiving, (d) => 
    //    { return d.city; });

    // Find max x 
    let maxX1 = d3.max(overallScore);

    // Create X scale
    x1 = d3.scaleLinear()
                .domain([0, maxX1])
                .range([margin.left, width-margin.right]); 
    
    // Add x axis 
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1))   
        .attr("font-size", '20px')
        .call((g) => g.append("text")
                      .attr("x", width - margin.right)
                      .attr("y", margin.bottom - 4)
                      .attr("fill", "black")
                      .attr("text-anchor", "end")
                      .text("Average Overall Rating Across Cities")
      );

    // Finx max y 
    let maxY1 = 10;

    // Create Y scale
    y1 = d3.scaleLinear()
                .domain([0, maxY1])
                .range([height - margin.bottom, margin.top]); 
       

     //Create y axis
      svg1.append("g")
      .attr("transform", `translate(${margin.left}, 0)`) 
      .call(d3.axisLeft(y1)) 
      .attr("font-size", '20px')
      .call((g) => g.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0-margin.left)
                    .attr("x", 0- (height/2)+20)
                    .attr("dy", "8em")
                    .attr('fill', 'black')
                    .style("text-anchor", "middle")
                    .text("Attribute Rating")
      ); 

  
  //Create x axis
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1)) 
        .attr("font-size", '20px'); 




/*
const mouseover = function(event, d) {
    d3.select(this).transition()
        .duration('100')
        .attr("r", 10);
        tooltip
        .style("opacity", 1)
        .html("City: " + d.city + "<br/>Cost of Living: " + d.rating + "<br/>Overall Rating: " 
        + d.overall)
        .style("left", d3.select(this).attr("cx") + 10 + "px") 
        .style("top", d3.select(this).attr("cy") - 15 + "px");
}


const mouseleave = function(event, d) {
    d3.select(this).transition()
        .attr("r", 8)
        .duration(100);
        tooltip.style("opacity", 0);
}
*/






    // Add points to Scatterplot
    myCircles = svg1.selectAll("circle")
                            .data(scatterData)
                            .enter()
                            .append("circle")
                              .attr("cx", (d) => x1(d.overall))
                              .attr("cy", (d) => y1(d.rating))
                              .attr("r", 8)
                              .style("fill", (d) => color(column))
                              .style("opacity", 0.5)
                              .on("mouseover", mouseover )
                              .on("mousemove", mousemove )
                              .on("mouseleave", mouseleave ); 
}


    function updateScatter(d,i) {
        column = i.attr;
        console.log(column);
        input = data.map(function(d) { return d[column] });
        cityCostOfLiving = [
        {city: cities, overall: overallScore, rating:input}];
        scatterData = [];
        for (let i = 0; i < cities.length; i++) {
            scatterData.push({city : cities[i], overall:overallScore[i], rating:input[i]})}
            console.log(scatterData);
            svg1.selectAll("circle").remove();
            myCircles = svg1.selectAll("circle")
                            .data(scatterData)
                            .enter()
                            .append("circle")
                              .attr("cx", (d) => x1(d.overall))
                              .attr("cy", (d) => y1(d.rating))
                              .attr("r", 8)
                              .style("fill", (d) => color(column))
                              .style("opacity", 0.5)
                              .on("mouseover", mouseover )
                              .on("mousemove", mousemove )
                              .on("mouseleave", mouseleave ); 
                             
    }

}); 