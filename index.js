const d3 = require("d3");
const cloud = require("d3-cloud");

// Set up the Looker Studio community visualization
const dscc = require("@looker/viz/dscc");
const LOCAL = false;

// Define visualization size
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the Word Cloud Function
function drawViz(data) {
  // Clear the previous visualization
  document.body.innerHTML = "";

  // Create the SVG container
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Extract words and their frequency
  const words = data.tables.DEFAULT.map(row => ({
    text: row.dimension[0],
    size: row.metric[0] * 10, // Adjust size based on metric value
  }));

  // Define word cloud layout
  const layout = cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .fontSize(d => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    svg
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", d => d.size + "px")
      .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}

// Listen for data updates
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });