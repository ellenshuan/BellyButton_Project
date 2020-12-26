function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var s_data = data.samples;
    //kelli
    var metadata = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filtered_ID = s_data.filter(object => object.id == sample);
    // kelli
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var first_sample = filtered_ID[0];
    // kelli
    var meta_sample = metaArray[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = first_sample.otu_ids;
    var otu_labels = first_sample.otu_labels;
    var sample_values = first_sample.sample_values;

    
    // var filtered_wfreq = metadata.filter(object => object.wfreq == sample);
    // var first_wfreq = filtered_wfreq[0];
    // var wfreq = first_wfreq.wfreq;

    // 3. Create a variable that holds the washing frequency.
   var frequency = parseFloat(meta_sample.wfreq)

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(x => `OTU ${x}`).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar", 
      orientation: "h",
      text: otu_labels.slice(0,10).reverse()
    }];
    
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Species",
      yaxis: {title: "OTU IDs"},
      xaxis: {title: "Number of Species"},
      margin: {t:30, l:150}
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [
      {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers", 
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {t:0},
      hovermode: "closest", 
      xaxis: {title: "OTU ID"},
      margin: {t:30}
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    console.log(frequency);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0,1], y: [0,1]},
        value : frequency, //wfreq
        title: {text: "Belly Button Frequency Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
          bar: { color: "black" },
          axis: { range: [null, 10] },
          steps:[
          { range: [0,2], color: "red" }, 
          { range: [2,4], color: "orange" },
          { range: [4,6], color: "yellow" }, 
          { range: [6,8], color: "limegreen"},
          { range: [8,10], color: "green"}
        ],
      }
    }
  ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 500,
      font: { color: "black", family: "Arial" }

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};
    