var end_ = 0


const ip_to_id = {
    '62.181.145.11' : 1,
    '9.2.12.8' : 2,
    '122.215.230.181' : 3,
    '154.113.230.216' : 4,
    '8.8.8.8' : 5,
}

// const ip_to_id = {
//     '1' : 1,
//     '2' : 2,
//     '3' : 3,
//     '4' : 4,
//     '5' : 5,
// }

var network;
var edges;
var nodes;
var data;
const node_labels = {
    1 : 'Requesting Host',
    2 : 'Local DNS Server',
    3 : 'Root DNS Server',
    4 : 'TLD DNS Server',
    5 : 'Authoritative DNS Server',
}
const next_ip = {
    2 : '122.215.230.181',
    3 : '154.113.230.216',
    4 : '8.8.8.8',
    5 : '10.8.10.8',
}


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

function p1_taskSelector(clickedButton, task_no) {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => button.classList.remove('depressed'));
        
    clickedButton.classList.add('depressed');

    buttons.forEach(button => {
        button.classList.add('disabled'); 
        button.disabled = true;
    });
    page1(task_no, buttons);
}

function p1_get_correctOrder(task_no){
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
            return p1_get_correctOrder(n);
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

    // Show Server with IP
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
    network = new vis.Network(container, data, options);

    [page01Order, find_mapping] = p1_get_correctOrder(task_no)
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
            setTimeout(() => alert("Task completed !!!"),300);
            
        }

    });



}

var task_btns;
var p2_idx = 0;
var p2_task_target = 1;
const p2_target_ip = "10.8.10.8";
// idx - tar
// 0 - 2
// 2 - 3
// 4 - 4
// 6 - 5
// i == (t-2)*2

function p2_taskSelector(clickedButton, task_no) {
    // task_no - 2 3 4 5 0 ; same as node_id
    const buttons = document.querySelectorAll('.task-button');
    buttons.forEach(button => button.classList.remove('depressed'));

    clickedButton.classList.add('depressed');

    buttons.forEach(button => {
        button.classList.add('disabled'); 
        button.disabled = true;
    });
    end_ = 0;
    if(task_no)
        page2(task_no, buttons);
    else{
        var n = Math.floor(Math.random() * 4) + 2;
        page2(n,buttons,1);
    }
}

function page2(task_no, btns, is_rand = 0){
    // Initialize data
    task_btns = btns;
    p2_task_target = task_no;
    clearLogEntry();
    p2_updateReply("",false);

    const container = document.getElementById('network');
    
    nodes = new vis.DataSet([
        { id: 1, label: 'Requesting Host\n62.181.145.11', x: -150, y: 150, shape: "image", image: "src/img/host.svg", },
        { id: 2, label: 'Local DNS Server\n9.2.12.8', x: -150, y: 0, shape: "image", image:"src/img/server.svg"},
        { id: 3, label: 'Root DNS Server', x: 150, y: -150, shape: "image", image:"src/img/server.svg" },
        { id: 4, label: 'TLD DNS Server', x: 150, y: 0, shape: "image", image:"src/img/server.svg" },
        { id: 5, label: 'Authoritative DNS Server', x: 150, y: 150, shape: "image", image:"src/img/server.svg" },
    ]);

    // Show Server with IP
    if (!is_rand){
        ip_server = nodes.get(task_no);
        ip_server.image = "src/img/IP_server.svg";
    }

    // Define edges (initially empty)
    edges = new vis.DataSet([]);

    // Provide data to the network
    data = { nodes, edges };

    // Options
    const options = {
        physics: { enabled: false },
        interaction: { dragNodes: false, dragView: false, zoomView: false, selectConnectedEdges: false},
    };

    // Create the network
    network = new vis.Network(container, data, options);
    
}

function p2_buttonPress(n){
    if(end_) return;
    if(n == 0){
        // Submit
        var inp = document.getElementById('user-input');
        inp = inp.value;
        inp = inp.trim();

        var chk_type = document.getElementById('btn1');
        var chk1 = chk_type.classList.contains('depressed')

        if (chk1){
            p2_send(inp);

        }
        else {
            logEntry('Error: Invalid Type selection');
        }
    }
    else{
        // Type Selection
        var b1 = document.getElementById(`btn${n}`);
        b1.classList.add('depressed');
        b1 = document.getElementById(`btn${3-n}`);
        b1.classList.remove('depressed');
    }

}

function p2_send(ip){
    const target_id = ip_to_id[ip]
    if(ip == p2_target_ip){
        end_ = 1;
        setTimeout(() => alert("Task completed !!!"), 1000);
        return;
    }
    if (ip in ip_to_id){
        if (target_id == 1){
            logEntry("Error: Self IP");
        }
        else if((target_id - 2)*2 == p2_idx) {
            edges.add({
                from: 1,
                to: target_id,
                arrows: 'to',
                label: `${++p2_idx}`,
                smooth: {
                    type: 'curvedCW',
                    roundness: 0.2
                },
                color: { color: '#00FF00' },
            });
            
            logEntry(`Query sent from Host to ${node_labels[target_id]}`);

            setTimeout(() => {
                edges.add({
                    from: target_id,
                    to: 1,
                    arrows: 'to',
                    label: `${++p2_idx}`,
                    smooth: {
                        type: 'curvedCW',
                        roundness: 0.2
                    },
                    color: { color: '#00FF00' },
                })
                logEntry(`Response received from ${node_labels[target_id]} - ${next_ip[target_id]}`);

                p2_updateReply(target_id == p2_task_target ? p2_target_ip : next_ip[target_id], target_id==5 ? "True": "False");

                if(target_id < p2_task_target){
                    nodes.update({
                        id: target_id+1, 
                        label:`${node_labels[target_id+1]}\n${next_ip[target_id]}`
                    });
                }
                else{
                    end_ = 1;
                }

                if (end_){
                    task_btns.forEach(button => {
                        button.classList.remove('disabled'); 
                        button.disabled = false;
                    });
                    // end_ = 0;
                    p2_idx = 0;
                    
                    setTimeout(() => alert("Task completed !!!"),300);
                    
                }

            }, 2000);

        }
        else{
            logEntry("Error: Wrong IP");
            var delID = edges.add({
                id: "to-be-deleted",
                from: 1,
                to: target_id,
                arrows: 'to',
                color: { color: '#FF0000' }, // Red for incorrect
            })[0];
            setTimeout(() => {
                edges.remove("to-be-deleted");
            }, 1000);
        }
    }
    else{
        logEntry("Error: Incorrect IP Address");
    }

    if(target_id == p2_task_target){
        end_ = 1;
    }

}

function p2_updateReply(ip, auth){
    var ip_txt = document.getElementById('return-ip');
    var auth_btn = document.getElementById('return-auth');
    var reply_txt = document.getElementById('reply-type-txt');
    var reply_btn = document.getElementById('reply-type-btn');
    
    if(ip != '') reply_btn.classList.add('depressed');
    if(auth == 'True') auth_btn.classList.add('depressed');
    setTimeout(() => {
        if(ip != '') reply_btn.classList.remove('depressed');
        if(auth == 'True') auth_btn.classList.remove('depressed');
    }, 500);
    
    ip_txt.textContent = ip;
    auth_btn.textContent = auth;
    if(ip == '')
            reply_txt.textContent = '';
    else
        reply_txt.textContent = ip == p2_target_ip ? 'A' : 'NS';

}




