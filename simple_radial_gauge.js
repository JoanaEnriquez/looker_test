// Create a new visualization
looker.plugins.visualizations.add({
  id: "simple_radial_gauge",
  label: "Simple Radial Gauge",
  options: {
    min: {
      type: "number",
      label: "Minimum Value",
      default: 0
    },
    max: {
      type: "number",
      label: "Maximum Value",
      default: 100
    },
    value: {
      type: "number",
      label: "Value",
      default: 50
    }
  },
  create: function(element, config) {
    // Load D3.js dynamically if it's not already loaded
    if (!window.d3) {
      var script = document.createElement("script");
      script.src = "https://d3js.org/d3.v5.min.js";
      script.onload = () => this.updateAsync([], element, config, {}, {}, () => {});
      document.head.appendChild(script);
    } else {
      this.updateAsync([], element, config, {}, {}, () => {});
    }
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    if (!window.d3) {
      console.error("D3 library not loaded");
      return;
    }

    // Set up the SVG canvas dimensions
    var width = element.clientWidth;
    var height = element.clientHeight;
    var radius = Math.min(width, height) / 2;

    // Clear any existing content
    d3.select(element).selectAll("*").remove();

    // Create the SVG element
    var svg = d3.select(element).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Draw the arc
    var arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("d", arc)
      .attr("fill", "#ccc");

    // Draw the needle
    var value = config.value;
    var min = config.min;
    var max = config.max;
    var angle = (value - min) / (max - min) * Math.PI - Math.PI / 2;

    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", radius * 0.9 * Math.cos(angle))
      .attr("y2", radius * 0.9 * Math.sin(angle))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    done();
  }
});
