looker.plugins.visualizations.add({
  id: "simple_radial_gauge",
  label: "Simple Radial Gauge",
  options: {
    value: {
      type: "number",
      label: "Value",
      default: 50
    }
  },
  create: function(element, config) {
    element.innerHTML = `
      <style>
        .gauge {
          width: 100%;
          height: 100%;
        }
      </style>
      <svg class="gauge"></svg>
    `;

    // Load D3.js if not already loaded
    if (!window.d3) {
      var script = document.createElement("script");
      script.src = "https://d3js.org/d3.v5.min.js";
      script.onload = () => this.updateAsync([], element, config, {}, {}, () => {});
      document.head.appendChild(script);
    }
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    if (!window.d3) {
      console.error("D3 library not loaded");
      return;
    }

    var value = config.value;

    var svg = d3.select(element).select(".gauge");
    var width = element.clientWidth;
    var height = element.clientHeight;
    var radius = Math.min(width, height) / 2;

    svg.selectAll("*").remove();

    // Create the background arc
    var arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("d", arc)
      .attr("fill", "#ccc")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create the needle
    var needleAngle = (value / 100) * Math.PI - Math.PI / 2;

    svg.append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr("x2", width / 2 + radius * 0.9 * Math.cos(needleAngle))
      .attr("y2", height / 2 + radius * 0.9 * Math.sin(needleAngle))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    done();
  }
});
