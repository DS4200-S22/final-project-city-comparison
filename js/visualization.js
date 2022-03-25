// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

let svg3 = d3.select("#vis-holder")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

let myBars;

d3.csv("data/pm_06_data.xlsx").then((consdata) => {
  //console.log(consdata.slice(0, 10));


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

    //to find the avg of the given attribute
    function avgAtrContinent(atr) 
    {
      return d3.mean(data.map(function(d){ return d.atr}));
    }

    const avgRatings = 
    [avgAtrContinent(attributes[0]), 
    avgAtrContinent(attributes[1]),
    avgAtrContinent(attributes[2]),
    avgAtrContinent(attributes[3])];

    console.log(attributes[0]);
    console.log(d3.mean(data.map(function(d){ return d.atr})));
    // Create X scale
    let x3 = d3.scaleBand()
            .domain(d3.range(attributes.length))
            .range([margin.left, width - margin.right])
            .padding(0.1); 
    
    // Add x axis 
    svg3.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
        .call(d3.axisBottom(x3)   
          .tickFormat(i => attributes[i]))
        .attr("font-size", '20px');

    // Find max y (50)
    let maxY3 = d3.max(avgRatings);

    // Create Y scale
    let y3 = d3.scaleLinear()
                .domain([0, maxY3])
                .range([height - margin.bottom, margin.top]); 

    // Add y axis 
    svg3.append("g")
        .attr("transform", `translate(${margin.left}, 0)`) 
        .call(d3.axisLeft(y3)) 
        .attr("font-size", '20px');


  // NEED TO FIGURE OUT MYBARS BELOW

    // Add points
    myBars = svg3.selectAll("bar")
                            .data(data)
                            .enter()
                              .append("rect")
                              .attr("x", (i) => x3(attributes[i]))
                              .attr("y", (i) => y3(avgRatings[i]))
                              .attr("height", height - margin.top - margin.bottom)
                              .attr("width", x3.bandwidth())
                              .style("fill", (d) => color((i) => attributes[i]));    
  }

//scatter plot
const ratings = (data.map(function(d){ return d[attributes[0]]}))
const overall_score = ["Overall Rating"]
const y_data = (data.map(function(d){ return d.(overall_score[0])}))

const svg1 = d3.select("#vis-holder")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]); 

let myCircles1;

let x1, y1, x2, y2, x3, y3;
let xKey1 = "City";
let yKey1 = "Average Ratings";


});
