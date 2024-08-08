looker.plugins.visualizations.add({
  id: "custom_test_viz", // Unique ID for your visualization
  label: "Test Visualization", // Display name in Looker
  create: function(element, config) {
    // This function runs when the visualization is first created
    element.innerHTML = "<p>Hello from the custom visualization!</p>";
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    // This function runs when data or configuration changes (but we won't use it here)
    done();
  }
});
