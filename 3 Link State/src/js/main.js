const answers = [
  [5, 2, 6],
  [4, 6, 3],
  [4, 1, 3],
  [4, 2, 4],
  [3, 1, 2],
];

const paths = [
  ["A-B", "A-C", "A-D"],
  ["A-E", "A-F", "B-C"],
  ["B-D", "B-E", "B-F"],
  ["C-D", "C-E", "C-F"],
  ["D-E", "D-F", "E-F"],
];

const values = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
function p1_generateTable() {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;
  values.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 5; i++) {
    const tableRow = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const cell1 = document.createElement("td");
      const span1 = document.createElement("span");
      span1.textContent = paths[i][j];
      cell1.appendChild(span1);
      tableRow.appendChild(cell1);

      const cellValue = values[i * 3 + j];
      const cell = document.createElement("td");
      const span = document.createElement("span");
      const inp = document.createElement("input");
      inp.id = `input_${i * 3 + j}`;

      if (cellValue) {
        // cell.classList.add('user-input');
        span.textContent = answers[i][j];
        cell.appendChild(span);
      } else {
        // span.textContent = 'Hello';
        cell.appendChild(inp);
      }
      tableRow.appendChild(cell);
    }
    tableBody.appendChild(tableRow);
  }
}

p1_generateTable(); // Generate the table on page load

function p1_validateTable() {
  var correct = true;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      if (values[i * 3 + j]) continue;
      const inp = document.getElementById(`input_${i * 3 + j}`);
      if (inp.value.trim() == `${answers[i][j]}`) {
        inp.style.borderColor = "green";
        inp.style.backgroundColor = "lightgreen";
      } else {
        inp.style.borderColor = "red";
        inp.style.backgroundColor = "lightcoral";
        correct = false;
      }
    }
  }
  setTimeout(function () {
    if (correct) alert("Please proceed to next page");
  }, 300);
}

function check_input1(inp, answer) {
  if (inp.value.trim().toLowerCase() === answer) {
    inp.style.borderColor = "green";
    inp.style.backgroundColor = "lightgreen";
    return 1;
  } else {
    inp.style.borderColor = "red";
    inp.style.backgroundColor = "lightcoral";
    return 0;
  }
}

function check_input2(inp1, answer1, inp2, answer2) {
  var c1, c2;
  if (inp1.value.trim().toLowerCase() === answer1) {
    inp1.style.borderColor = "green";
    inp1.style.backgroundColor = "lightgreen";
    c1 = 1;
  } else {
    inp1.style.borderColor = "red";
    inp1.style.backgroundColor = "lightcoral";
    c1 = 0;
  }
  if (inp2.value.trim().toLowerCase() === answer2) {
    inp2.style.borderColor = "green";
    inp2.style.backgroundColor = "lightgreen";
    c2 = 1;
  } else {
    inp2.style.borderColor = "red";
    inp2.style.backgroundColor = "lightcoral";
    c2 = 0;
  }
  return c1 && c2;
}

function p2_validate() {
  // answers - (2,x) , (y,4) , 1, x
  let input1 = document.getElementById("p2_input1");
  let input2 = document.getElementById("p2_input2");
  let input3 = document.getElementById("p2_input3");
  let input4 = document.getElementById("p2_input4");
  let input5 = document.getElementById("p2_input5");
  let input6 = document.getElementById("p2_input6");

  let tab2 = document.querySelector(".p2_tab-cont2").style.display;
  let tab3 = document.querySelector(".p2_tab-cont3").style.display;
  let tab4 = document.querySelector(".p2_tab-cont4").style.display;

  if (tab2 === "none") {
    chk = check_input2(input1, "2", input2, "x");
    // chk = 1;
    if (chk == 1) {
      document.querySelector(".p2_tab-cont2").style.display = "block";
    }
  } else if (tab3 === "none") {
    chk = check_input2(input3, "y", input4, "4");
    // chk = 1;
    if (chk == 1) {
      document.querySelector(".p2_tab-cont3").style.display = "block";
    }
  } else if (tab4 === "none") {
    chk = check_input1(input5, "1");
    // chk = 1;
    if (chk == 1) {
      document.querySelector(".p2_tab-cont4").style.display = "block";
    }
  } else {
    chk = check_input1(input6, "x");
    setTimeout(function () {
      if (chk == 1) alert("Great! Please proceed to next page");
    }, 300);
  }
}

function p3_generateRow(id) {
  const tableRow = document.getElementById(`tr${id}`);
  if (!tableRow) return;
  const tHead = document.createElement("th");
  tHead.scope = "row";
  tHead.textContent = "Cost/Path";
  const dash = document.createElement("td");
  dash.textContent = "-";
  tableRow.appendChild(tHead);
  tableRow.appendChild(dash);
  const nodes = ["v", "x", "y", "z"];
  for (let i = 0; i < 4; i++) {
    const td = document.createElement("td");
    const span = document.createElement("span");
    const inpD = document.createElement("input");
    const inpP = document.createElement("input");
    inpD.id = `p3_${id}${nodes[i]}d`;
    inpD.type = "text";
    inpD.className = "p3_input";
    inpD.autocomplete = "off";
    inpP.id = `p3_${id}${nodes[i]}p`;
    inpP.type = "text";
    inpP.className = "p3_input";
    inpP.autocomplete = "off";
    span.appendChild(inpD);
    // const slash = document.createElement("p");
    // slash.textContent = "/";
    const innerspan = document.createElement("span");

    innerspan.textContent = " / ";
    // span.appendChild(slash);
    // span.innerHTML = "/"
    span.appendChild(innerspan);
    span.appendChild(inpP);
    // span.innerText = "/";
    td.appendChild(span);
    tableRow.appendChild(td);
  }
}
p3_generateRow(1);

function check_input(inpD, inpP, ans) {
  var chkArr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    if (inpD[i].value.trim().toUpperCase() === ans[0][i]) {
      inpD[i].style.borderColor = "green";
      inpD[i].style.backgroundColor = "lightgreen";
      chkArr[0][i] = 1;
    } else {
      inpD[i].style.borderColor = "red";
      inpD[i].style.backgroundColor = "lightcoral";
      chkArr[0][i] = 0;
    }
  }
  for (let i = 0; i < 4; i++) {
    if (inpP[i].value.trim().toUpperCase() === ans[1][i]) {
      inpP[i].style.borderColor = "green";
      inpP[i].style.backgroundColor = "lightgreen";
      chkArr[1][i] = 1;
    } else {
      inpP[i].style.borderColor = "red";
      inpP[i].style.backgroundColor = "lightcoral";
      chkArr[1][i] = 0;
    }
  }

  var ret = 1;
  for (const chk of chkArr) {
    for (const c of chk) {
      ret &= c;
    }
  }

  return ret;
}

function p3_validate() {
  // answers - 5U, 2U, 6V, 10V; 5U, 2U, 3X, 10V; 4Y, 2U, 3X, 5Y; 4Y, 2U, 3X, 5Y;
  var tab2 = document.querySelector(".p3_tab-cont2").style.display;
  var tab3 = document.querySelector(".p3_tab-cont3").style.display;
  var tab4 = document.querySelector(".p3_tab-cont4").style.display;
  const answer = [
    [
      ["5", "2", "6", "10"],
      ["U", "U", "V", "V"],
    ],
    [
      ["5", "2", "3", "10"],
      ["U", "U", "X", "V"],
    ],
    [
      ["4", "2", "3", "5"],
      ["Y", "U", "X", "Y"],
    ],
    [
      ["4", "2", "3", "5"],
      ["Y", "U", "X", "Y"],
    ]
  ];
  const nodes = ["v", "x", "y", "z"];
  if (tab2 === "none") {
    var inpArrD = [];
    var inpArrP = [];

    for (let i = 1; i <= 4; i++) {
      var inpD = document.getElementById(`p3_1${nodes[i-1]}d`);
      var inpP = document.getElementById(`p3_1${nodes[i-1]}p`);
      inpArrD.push(inpD);
      inpArrP.push(inpP);

      // console.log(inpD);
    }
    chk = check_input(inpArrD, inpArrP, answer[0]);
    // chk = 1;
    if(chk == 1) {
      document.querySelector(".p3_tab-cont2").style.display = "block";
      p3_generateRow(2);
    }
  }
  else if (tab3 === "none") {
    var inpArrD = [];
    var inpArrP = [];

    for (let i = 1; i <= 4; i++) {
      var inpD = document.getElementById(`p3_2${nodes[i-1]}d`);
      var inpP = document.getElementById(`p3_2${nodes[i-1]}p`);
      inpArrD.push(inpD);
      inpArrP.push(inpP);

      // console.log(inpD);
    }
    chk = check_input(inpArrD, inpArrP, answer[1]);
    // chk = 1;
    if(chk == 1) {
      document.querySelector(".p3_tab-cont3").style.display = "block";
      p3_generateRow(3);
    }
  }
  else if (tab4 === "none") {
    var inpArrD = [];
    var inpArrP = [];

    for (let i = 1; i <= 4; i++) {
      var inpD = document.getElementById(`p3_3${nodes[i-1]}d`);
      var inpP = document.getElementById(`p3_3${nodes[i-1]}p`);
      inpArrD.push(inpD);
      inpArrP.push(inpP);

      // console.log(inpD);
    }
    chk = check_input(inpArrD, inpArrP, answer[2]);
    // chk = 1;
    if(chk == 1) {
      document.querySelector(".p3_tab-cont4").style.display = "block";
      p3_generateRow(4);
    }
  } else {
    var inpArrD = [];
    var inpArrP = [];

    for (let i = 1; i <= 4; i++) {
      var inpD = document.getElementById(`p3_4${nodes[i-1]}d`);
      var inpP = document.getElementById(`p3_4${nodes[i-1]}p`);
      inpArrD.push(inpD);
      inpArrP.push(inpP);

      // console.log(inpD);
    }
    // console.log(inpArrD);
    // console.log(inpArrP);
    chk = check_input(inpArrD, inpArrP, answer[3]);
    // chk = 1;
    setTimeout(function () {
      if (chk == 1) alert("Great! Practice completed successfully");
    }, 300);
  }
}

const randArr = [1, 1, 1, 1, 0, 0];
function p4_generateTable(){
  const tr1 = document.getElementById("p4_tr1");
  const tr2 = document.getElementById("p4_tr2");

  if(!tr1 || !tr2) return;

  while (!(randArr[4] || randArr[5])) {
    randArr.sort(() => Math.random() - 0.5);
  } // ensures atleast one input for table 2

  const values = ["5", "1", "2", "2", "1", "2"];
  const tHead = document.createElement("th");
  tHead.scope = "row";
  tHead.textContent = "Distance";
  const tHead1 = document.createElement("th");
  tHead1.scope = "row";
  tHead1.textContent = "Distance";
  tr1.appendChild(tHead);
  tr2.appendChild(tHead1);


  var count = 0;
  
  for(let i=0; i<6; i++){
    if(i == 3){
      const td = document.createElement("td");
      td.textContent = "INF";
      tr1.appendChild(td);
    }
    else if(i == 4){
      const td = document.createElement("td");
      td.textContent = "-";
      tr1.appendChild(td);
    }
    else{
      if(randArr[count]){
        // input
        const inp = document.createElement("input");
        inp.id = count;
        inp.autocomplete = "off";
        inp.type = "text";
        const td = document.createElement("td");
        td.appendChild(inp);
        tr1.appendChild(td);
      }
      else{
        // show answer
        const td = document.createElement("td");
        td.textContent = values[count];
        tr1.appendChild(td);
      }
        count++;
    }
  }
  for(let i=0; i<5; i++){
    if(i < 3){
      const td = document.createElement("td");
      td.textContent = "INF";
      tr2.appendChild(td);
    }
    else{
      if(randArr[count]){
        // input - 1
        const inp = document.createElement("input");
        inp.id = count;
        inp.autocomplete = "off";
        inp.type = "text";
        const td = document.createElement("td");
        td.appendChild(inp);
        tr2.appendChild(td);
      }
      else{
        // show answer - 0
        const td = document.createElement("td");
        td.textContent = values[count];
        tr2.appendChild(td);
      }
        count++;
    }
  }
  const td = document.createElement("td");
      td.textContent = "-";
      tr2.appendChild(td);
}

p4_generateTable();

function p4_validateTable(){
  const answer = ["5", "1", "2", "2", "1", "2"];
  var correct = true;
  for (let i = 0; i < 6; i++) {
      if (!randArr[i]) continue;
      const inp = document.getElementById(`${i}`);
      if (inp.value.trim() == `${answer[i]}`) {
        inp.style.borderColor = "green";
        inp.style.backgroundColor = "lightgreen";
      } else {
        inp.style.borderColor = "red";
        inp.style.backgroundColor = "lightcoral";
        correct = false;
      }
  }
  setTimeout(function () {
    if (correct) alert("Please proceed to next page");
  }, 300);
  
}