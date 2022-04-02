// Bar and Bubble charts
function init() {

  var selector = d3.select("#selDataset");


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

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
       // 3. Create a variable that holds the samples array. 
       var sampleArray = data.samples;
       // 4. Create a variable that filters the samples for the object with the desired sample number.
   var filteredArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
       //  5. Create a variable that holds the first sample in the array.
   var firstSample = filteredArray[0];
   
       // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
   var otu_ids = firstSample.otu_ids;
   var otu_labels = firstSample.otu_labels;
   var sample_values = firstSample.sample_values;
   var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

   // 8. Create the trace for the bar chart. 
       var barData = [
         {
           y: yticks,
           x: sample_values.slice(0, 10).reverse(),
           text: otu_labels.slice(0, 10).reverse(),
           type: "bar",
           orientation: "h",
         }
       ];
   
   
       // 9. Create the layout for the bar chart. 
       var barLayout = {
         title: "BellyButton Bar Chart"
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData,barLayout)
      
    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
  

    // 1. Create the trace for the bubble chart.

      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Jet"
          }
        }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bubble Chart"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
}
