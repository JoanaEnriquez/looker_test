// Ensure D3 is available
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
    element.innerHTML = `
      <style>
        .gauge {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 50%;
        }
        .gauge .background {
          fill: #eee;
        }
        .gauge .foreground {
          fill: steelblue;
        }
        .gauge .needle {
          stroke: #666;
          stroke-width: 2;
        }
      </style>
      <svg class="gauge"></svg>
    `;

    // Dynamically load the D3 library
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

    var svg = d3.select(element).select(".gauge");
    var width = svg.node().getBoundingClientRect().width;
    var height = width / 2;
    var radius = Math.min(width, height) / 2;

    svg.selectAll("*").remove(); // Clear previous content

    // Create background arc
    var arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("class", "background")
      .attr("d", arc)
      .attr("transform", `translate(${width / 2}, ${height})`);

    // Create needle
    var value = config.value;
    var min = config.min;
    var max = config.max;
    var angle = (value - min) / (max - min) * Math.PI - Math.PI / 2;

    svg.append("line")
      .attr("class", "needle")
      .attr("x1", width / 2)
      .attr("y1", height)
      .attr("x2", width / 2 + radius * 0.9 * Math.cos(angle))
      .attr("y2", height + radius * 0.9 * Math.sin(angle));

    done();
  }
});
