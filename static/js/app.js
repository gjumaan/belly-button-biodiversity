// Create a function that populates the dropdown box with test subject id
const buildDropdown = () => {
    // Use d3 to work with json file
    d3.json("samples.json").then(data => {
        // Grab the dropdown box
        const dropdown = d3.select("#selDataset");
        // Grab the test subject ids
        const ids = data.names;
        // Append the ids to the dropdown 
        ids.forEach(id => dropdown.append("option").text(id).property('value', id));
    });
};

// Create a function that populates the demographic box with metadata for a given id
const buildDemographic = (id) => {
    d3.json("samples.json").then(data => {
        // Grab the demographic box
        const panel = d3.select("#sample-metadata");
        // Clear any exisiting data
        panel.html("")
        // Grab the metadata
        const metadata = data.metadata;
        // Filter the metadata according to the respective id
        const filteredMetadata = metadata.filter(sample => sample.id == id)[0];
        // Display metadata info for the respective id
        Object.entries(filteredMetadata).forEach(([key, value]) => panel.append("h6").text(`${key.toUpperCase()}: ${value}`));
    });
};

// Create a function that shows the top 10 OTU for a given id as a horizontal graph
const buildHorizontalGraph = (id) => {
    d3.json("samples.json").then(data => {
        // Grab the samples
        const samples = data.samples;
        // Filter the samples according to the respective id
        const filteredSamples = samples.filter(sample => sample.id == id)[0];
        // Grab the necessary info to build the graph
        const otuIds = filteredSamples.otu_ids;
        const otuLabels = filteredSamples.otu_labels;
        const sampleValues = filteredSamples.sample_values;
        // Create the graph
        const graphData = [{
            y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
            x: sampleValues.slice(0,10).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h',
            width: 0.8,
        }];
        const layout = {
            title: "Top 10 Bacteria Cultures Found",

            showlegend: false,
            xaxis: {
                zeroline: true,
                title: "Sample Value",
            },
            yaxis: {
                zeroline: true,
                title: "OTU ID"
            },
            height: 400,
            width: 950,
            margin: { t: 25, b: 40 }
        };
        Plotly.newPlot("bar", graphData, layout);
    });
};

// Create a function that shows the top 10 OTU for a given id as a bubble graph
const buildBubbleGraph = (id) => {
    d3.json("samples.json").then(data => {
        // Grab the samples
        const samples = data.samples;
        // Filter the samples according to the respective id
        const filteredSamples = samples.filter(sample => sample.id == id)[0];
        // Grab the necessary info to build the graph
        const otuIds = filteredSamples.otu_ids;
        const otuLabels = filteredSamples.otu_labels;
        const sampleValues = filteredSamples.sample_values;
        // Create the graph
        const graphData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIds,
                size: sampleValues
            }
        }];
        const layout = {
            title: "Bacteria Cultures Per Sample",
            showlegend: false,
            xaxis: {
                zeroline: true,
                title: "OTU ID",
            },
            yaxis: {
                zeroline: true,
                title: "Sample Value"
            },
            height: 600,
            width: 1280,
        };
        Plotly.newPlot("bubble", graphData, layout, {scrollZoom: true});
    });
};

// Load page with initial data
const initialLoad = () => {
    buildDropdown();
    buildDemographic(940);
    buildHorizontalGraph(940);
    buildBubbleGraph(940);
};

initialLoad();

// Create a function that loads different graphs and data for each id
const optionChanged = (id) => {
    buildDemographic(id);
    buildHorizontalGraph(id);
    buildBubbleGraph(id);
};