// Get the container
const container = document.getElementById('network');

// Define nodes
const nodes = new vis.DataSet([
    { id: 1, label: 'Requesting Host', x: -150, y: 150, shape: "image", image: "src/img/host.svg"},
    { id: 2, label: 'Local DNS Server', x: -150, y: 0, shape: "image", image:"src/img/server.svg"},
    { id: 3, label: 'Root DNS Server', x: 0, y: -150, shape: "image", image:"src/img/server.svg" },
    { id: 4, label: 'TLD DNS Server', x: 150, y: 0, shape: "image", image:"src/img/server.svg" },
    { id: 5, label: 'Authoritative DNS Server', x: 150, y: 150, shape: "image", image:"src/img/server.svg" },
]);

// Define edges (initially empty)
const edges = new vis.DataSet([]);

// Provide data to the network
const data = { nodes, edges };

// Options
const options = {
    physics: { enabled: false },
    interaction: { dragNodes: false, dragView: false, zoomView: false, selectConnectedEdges: false},
};

// Create the network
const network = new vis.Network(container, data, options);

// Recursive DNS logic order
const correctOrder = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 4],
    [4, 3],
    [3, 2],
    [2, 1],
];

var idx = 0;
// Variables to store clicks
let firstClick = null;
let secondClick = null;

// Handle node clicks
network.on('click', function (params) {
    if (params.nodes.length > 0) {
        const clickedNode = params.nodes[0];

        if (!firstClick) {
            // Store the first node
            firstClick = clickedNode;
        } else {
            // Second node clicked; create edge
            secondClick = clickedNode;

            // Check if the edge is valid
            var isCorrect = false;
            if(correctOrder[idx][0] === firstClick && correctOrder[idx][1] === secondClick)
                isCorrect = true;
                

            if (isCorrect) {
                idx++;
                console.log(`Correct: Edge from ${firstClick} to ${secondClick}`);
                edges.add({
                    from: firstClick,
                    to: secondClick,
                    arrows: 'to',
                    label: `${idx}`,
                    smooth: { type: 'curvedCW', roundness: 0.2 },
                    color: { color: '#00FF00' }, // Green for correct
                });

            } else {
                console.error(`Incorrect: Edge from ${firstClick} to ${secondClick}`);
                const delID = edges.add({
                    id : "to-be-deleted",
                    from: firstClick,
                    to: secondClick,
                    arrows: 'to',
                    color: { color: '#FF0000' }, // Red for incorrect
                })[0];
                setTimeout(() =>{ 
                    edges.remove("to-be-deleted")
                }, 1000);
                
            }
            setTimeout(() => {
                network.selectNodes([]);
            }, 1000); 

            firstClick = null;
        }

        // setTimeout()
    }
});

// Reset highlights and edges (Optional for replay)
function resetNetwork() {
    edges.clear();
    firstClick = null;
}
