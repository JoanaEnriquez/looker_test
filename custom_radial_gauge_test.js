looker.plugins.visualizations.add({
  id: "custom_radial_gauge",
  label: "Custom Radial Gauge",
  options: {
    min: {
      type: "number",
      label: "Minimum Value",
      default: 0
    },
    max: {
      type: "number",
      label: "Maximum Value",
      default: 40000
    },
    segments: {
      type: "array",
      label: "Segments",
      default: [
        { value: 6000, color: "red" },
        { value: 10000, color: "orange" },
        { value: 40000, color: "green" }
      ]
    },
    needleValue: {
      type: "string",
      label: "Needle Value Field",
      default: ""
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
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    if (!data.length || !queryResponse.fields.measures.length) {
      this.addError({title: "No Data or Invalid Configuration", message: "Please check your query and configuration."});
      return;
    }

    var svg = d3.select(element).select(".gauge");
    var width = svg.node().getBoundingClientRect().width;
    var height = width / 2;
    var radius = Math.min(width, height) / 2;

    svg.selectAll("*").remove(); // Clear previous content

    var min = config.min;
    var max = config.max;
    var segments = config.segments;
    var needleValueField = config.needleValue;

    // Create color scale based on segments
    var colorScale = d3.scaleThreshold()
      .domain(segments.map(segment => segment.value))
      .range(segments.map(segment => segment.color));

    var arc = d3.arc()
      .innerRadius(0.65 * radius)
      .outerRadius(0.85 * radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    var partitions = d3.range(min, max, (max - min) / 10);

    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return 1; });

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height + ")");

    var path = g.selectAll(".arc")
      .data(pie(partitions))
      .enter().append("path")
      .attr("fill", function(d, i) {
        var value = min + i * (max - min) / 10;
        return colorScale(value);
      })
      .attr("d", arc)
      .each(function(d) { this._current = d; });

    // Add value labels
    g.selectAll(".arc-value")
      .data(pie(partitions))
      .enter().append("text")
      .attr("transform", function(d) {
        var outerArc = d3.arc()
          .innerRadius(0.85 * radius)
          .outerRadius(0.95 * radius);
        return "translate(" + outerArc.centroid(d)[0] + "," + outerArc.centroid(d)[1] + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", function(d) {
        var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .text(function(d, i) {
        var value = min + i * (max - min) / 10;
        return value;
      });

    // Needle
    var needle = g.append("line")
      .attr("class", "needle")
      .attr("x1", 0)
      .attr("y1", -0.3 * radius)
      .attr("x2", 0)
      .attr("y2", -0.8 * radius)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    var value = data[0][needleValueField].value;
    var angle = (value - min) / (max - min) * Math.PI - Math.PI / 2;
    needle.attr("transform", "rotate(" + (angle * 180 / Math.PI) + ")");

    done();
  }
});
