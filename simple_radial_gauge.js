looker.plugins.visualizations.add({
  id: "simple_visualization",
  label: "Simple Visualization",
  create: function(element, config) {
    element.innerHTML = `
      <style>
        .viz-container {
          width: 100%;
          height: 100%;
        }
      </style>
      <div class="viz-container"></div>
    `;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    var container = element.querySelector('.viz-container');

    // Clear any existing content
    container.innerHTML = '';

    // Create a simple rectangle
    var rect = document.createElement('div');
    rect.style.width = '100px';
    rect.style.height = '100px';
    rect.style.backgroundColor = 'blue';

    // Append the rectangle to the container
    container.appendChild(rect);

    done();
  }
});
