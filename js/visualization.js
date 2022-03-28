// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;


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
 

let myBars;
let myCircles;

d3.csv("data/pm_06_data.csv").then((consdata) => {
  console.log(consdata.slice(0, 10));


//bar chart

//average each attribute in category across continent - AvgRating
//plot bar chart: x-axis -> category for continent, y-axis -> AvgRating

{

    const attributes = ["Cost of Living", "Housing", "Healthcare", "Leisure & Culture"];
    const color = d3.scaleOrdinal()
                    .domain(["Cost of Living", "Housing", "Healthcare", "Leisure & Culture"])
                    .range(["#FF7F50", "#21908dff", "#fde725ff", "#fde765ff"]);

    //sample continent selection
    //reference:
    //https://stackoverflow.com/questions/23156864/d3-js-filter-from-csv-file-using-multiple-columns
    var data = consdata.filter(function(d) 
    { 
        if( d["UA_Continent"] == "North America")
        { 
            return d;
        } 
    });


var costOfLiving = data.map(function(d) { return d["Cost of Living"] });
var housing = data.map(function(d) { return d["Housing"] });
var healthcare = data.map(function(d) { return d["Healthcare"] });
var leisureCulture = data.map(function(d) { return d["Leisure & Culture"] });

/*
    const avgRatings = [(d3.mean(costOfLiving)),
    (d3.mean(housing)),
    (d3.mean(healthcare)),
    (d3.mean(leisureCulture))];
    */

    const avgRatings = [
    {attr : "Cost of Living", rating:(d3.mean(costOfLiving))},
    {attr : "Housing", rating:(d3.mean(housing))},
    {attr : "Healthcare", rating:(d3.mean(healthcare))},
    {attr : "Leisure & Culture", rating:(d3.mean(leisureCulture))}
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
        .attr("font-size", '20px');

    // Add points
    myBars = svg3.selectAll("bar")
                            .data(avgRatings)
                            .enter()
                              .append("rect")
                              .attr("x", (d,i) => x3(i))
                              .attr("y", (d) => y3(d.rating))
                              .attr("height", (d) => (height - margin.bottom) - y3(d.rating)) 
                              .attr("width", x3.bandwidth())
                              .style("fill", (d) => color(d.attr));       
  }

//scatter plot
{
/*
const ratings = (data.map(function(d){ return d[attributes[0]]}))
const overall_score = ["Overall Rating"]
const y_data = (data.map(function(d){ return d.(overall_score[0])}))
*/


let overallScore = data.map(function(d) { return d["Overall Rating"] });
let cities = data.map(function(d) { return d["UA_Name"] });
const cityCostOfLiving = [
    {city: cities, overall: overallScore, rating:costOfLiving}];
    console.log(cityCostOfLiving);


// Find max x
   // let maxX1 = d3.max(cityCostOfLiving, (d) => 
    //    { return d.city; });

    // Finx max x 
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
    let maxY1 = d3.max(costOfLiving);

    // Create Y scale
    y1 = d3.scaleLinear()
                .domain([0, maxY1])
                .range([height - margin.bottom, margin.top]); 
       

     //Create y axis
      svg1.append("g")
      .attr("transform", `translate(${margin.left}, 0)`) 
      .call(d3.axisLeft(y1)) 
      .attr("font-size", '20px'); 
  
  //Create x axis
    svg1.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x1)) 
        .attr("font-size", '20px'); 

    // Add points
    myCircles = svg1.selectAll("circle")
                            .data(cityCostOfLiving)
                            .enter()
                              .append("circle")
                              .attr("cx", (d) => x1(d.overall))
                              .attr("cy", (d) => y1(d.rating))
                              .attr("r", 8)
                              //.style("fill", (d) => color(d.attr))
                              .style("opacity", 0.5);
       



   
}

}); 