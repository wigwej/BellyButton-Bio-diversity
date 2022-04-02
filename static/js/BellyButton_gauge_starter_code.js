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

    //Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
var filteredArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata

    // Create a variable that holds the first sample in the array.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var firstSample = filteredArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
   var washingfreq = parseFloat(firstMetadata.wfreq)
    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Use Plotly to plot the bar data and layout.
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
   
  
    
    // Use Plotly to plot the bubble data and layout.
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
    
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{type: "indicator",

    mode: "gauge+number",
    value: washingfreq,
    gauge: {
      axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [

        { range: [0, 5], color: "cyan" },

        { range: [5, 10], color: "coral" }

      ],

      threshold: {

        line: { color: "red", width: 4 },

        thickness: 0.75,

        value: 490

      }

    }

  }

];

    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title:"Gauge",
     
     width: 500,

     height: 400,
   
     margin: { t: 25, r: 25, l: 25, b: 25 },
   
     paper_bgcolor: "lavender",
   
     font: { color: "darkblue", family: "Arial" }
   
   };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
