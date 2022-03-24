// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

let myBars;

d3.csv("data/Cleaned_CityLife.csv").then((data) => {
  console.log(data.slice(0, 10));


//bar chart

//average each attribute in category across continent - AvgRating
//plot bar chart: x-axis -> category for continent, y-axis -> AvgRating

{

    const attributes = ["Cost of Living", "Housing", "Healthcare", "Leisure & Culture"];

    const avgRatings = [d3.mean(data.map(function(d){ return d.attributes[0]})),
       d3.mean(data.map(function(d){ return d.attributes[1]})),
       d3.mean(data.map(function(d){ return d.attributes[2]})),
       d3.mean(data.map(function(d){ return d.attributes[3]}))];

    // Create X scale
    let x3 = d3.scaleBand()
            .domain(d3.range(counts.length))
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
                            .data(counts)
                            .enter()
                              .append("rect")
                              .attr("x", (d,i) => x3(i))
                              .attr("y", (d) => y3(d.count))
                              .attr("height", (d) => (height - margin.bottom) - y3(d.count)) 
                              .attr("width", x3.bandwidth())
                              .style("fill", (d) => color(d.species));    
  }

//scatter plot

});
