var end_ = 0
function logEntry(msg) {
    let li = document.createElement("li");
    let text = document.createTextNode(msg);
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
    li.scrollIntoView();
}

function clearLogEntry(){
    let ul = document.getElementById("log");
    ul.innerHTML = "";
}

function get_correctOrder(task_no){
    var order, mapping; // the value of second click when IP is found
    switch(task_no){
        case 1:
            order = [
                [1, 2],
                [2, 1]
            ]
            mapping = 2
            break;
        case 2:
            order = [
                [1, 2],
                [2, 3],
                [3, 2],
                [2, 1]
            ]
            mapping = 3
            break;
        case 3:
            order = [
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 3],
                [3, 2],
                [2, 1]
            ]
            mapping = 4
            break;
        case 4:
            order = [
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 5],
                [5, 4],
                [4, 3],
                [3, 2],
                [2, 1]
            ]
            mapping = 5
            break;
        case 5:
            var n = Math.floor(Math.random() * 4) + 1;
            return get_correctOrder(n);
        }
        return [order, mapping]
}

function page1(task_no, btns){
    clearLogEntry();
    // Get the container
    const container = document.getElementById('network');

    // Define nodes
    var nodes = new vis.DataSet([
        { id: 1, label: 'Requesting Host', x: -150, y: 150, shape: "image", image: "src/img/host.svg", },
        { id: 2, label: 'Local DNS Server', x: -150, y: 0, shape: "image", image:"src/img/server.svg"},
        { id: 3, label: 'Root DNS Server', x: 0, y: -150, shape: "image", image:"src/img/server.svg" },
        { id: 4, label: 'TLD DNS Server', x: 150, y: 0, shape: "image", image:"src/img/server.svg" },
        { id: 5, label: 'Authoritative DNS Server', x: 150, y: 150, shape: "image", image:"src/img/server.svg" },
    ]);

    if (task_no < 5){
        ip_server = nodes.get(task_no+1);
        ip_server.image = "src/img/IP_server.svg";
    }
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

    [page01Order, find_mapping] = get_correctOrder(task_no)
    var mode = 1

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
                if(page01Order[idx][0] === firstClick && page01Order[idx][1] === secondClick)
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

                    var fc = nodes.get(firstClick), sc = nodes.get(secondClick);
                    var log_txt = mode ? "Valid query" : "Reply";
                    if (firstClick < secondClick)
                        logEntry(`${log_txt} from ${fc.label} to ${sc.label}`);
                    else
                    logEntry(`${log_txt} from ${fc.label} to ${sc.label}`);

                    if (secondClick == find_mapping){
                        mode = 0
                        logEntry(`IP Address found at ${sc.label}`);
                    }

                    if (secondClick == 1){
                        end_ = 1;
                        console.log(end_);
                    }


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
                    logEntry("Wrong Query")
                    
                }
                setTimeout(() => {
                    network.selectNodes([]);
                }, 1000); 

                firstClick = null;
            }

   
        }
        if (end_){
            btns.forEach(button => {
                button.classList.remove('disabled'); 
                button.disabled = false;
            });
            end_ = 0;
            setTimeout(() => {
                alert("Task completed !!!")
            }, 300);
        }

    });
    // return new Promise(resolve => setTimeout(resolve));

    // Reset highlights and edges (Optional for replay)
//     function resetNetwork() {
//         edges.clear();
//         firstClick = null;
// }


}






