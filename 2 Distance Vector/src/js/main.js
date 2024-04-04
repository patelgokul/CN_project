// alert("working");

const answers = [
  [5, 2, 6],
  [4, 6, 3],
  [4, 1, 3],
  [4, 2, 4],
  [3, 1, 2]
];

const paths = [
  ["A-B", "A-C", "A-D"],
  ["A-E", "A-F", "B-C"],
  ["B-D", "B-E", "B-F"],
  ["C-D", "C-E", "C-F"],
  ["D-E", "D-F", "E-F"]
];
const values = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function p1_generateTable() {
  const tableBody = document.getElementById('tableBody');
  if(!tableBody)
    return;
  values.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 5; i++) {
    const tableRow = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
      const cell1 = document.createElement('td');
      const span1 = document.createElement('span');
      span1.textContent = paths[i][j];
      cell1.appendChild(span1);
      tableRow.appendChild(cell1);


      const cellValue = values[i * 3 + j];
      const cell = document.createElement('td');
      const span = document.createElement('span');
      const inp = document.createElement('input');
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

function validateTable() {
  var correct = true;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      if (values[i * 3 + j])
        continue;
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



function generateTable(pageNo, currNode, values, nodes, answers) {
  const tableBody = document.getElementById(`${pageNo}_${currNode}_tableBody`);
  if(!tableBody)
    return;
  values.sort(() => Math.random() - 0.5);

  // Clear existing table rows
  // tableBody.innerHTML = '';

  // Create table rows with data
  const tableRow1 = document.createElement('tr');
  const cell = document.createElement('th');
  cell.textContent = "Node";
  tableRow1.appendChild(cell);
  for (let j = 0; j < 5; j++) {
    const cell1 = document.createElement('td');
    const span1 = document.createElement('span');
    span1.textContent = nodes[j];
    cell1.appendChild(span1);
    tableRow1.appendChild(cell1);
  }
  tableBody.appendChild(tableRow1);
  const tableRow2 = document.createElement('tr');
  const cell2 = document.createElement('th');
  cell2.textContent = "Distance";
  tableRow2.appendChild(cell2);
  for (let j = 0; j < 5; j++) {
    const cellValue = values[j];
    const cell = document.createElement('td');
    const span = document.createElement('span');
    const inp = document.createElement('input');
    inp.id = `input_${pageNo}_${currNode}_${j}`;
    inp.autocomplete="off";
    inp.type = "text";

    if (cellValue) {
      // cell.classList.add('user-input');
      span.textContent = answers[j];
      cell.appendChild(span);

    } else {
      // span.textContent = 'Hello';
      cell.appendChild(inp);
    }
    tableRow2.appendChild(cell);
  }
  tableBody.appendChild(tableRow2);
}

const valueA = [1,1,1,0,0];
const valueB = [1,1,0,0,0];
const valueC = [1,1,0,0,0];
const answerA = [5,2,6,4,6];
const answerB = [5,3,4,1,3];
const answerC = [2,3,4,2,4];
const newValueA = [1,1,1,0,0];
const newValueB = [1,1,0,0,0];
const newAnswerA = [5,2,6,4,7];
const newAnswerB = [5,3,7,1,8];
generateTable('p2', 'A', [1,1,1,1,1], ['B', 'C','D','E','F'], answerA); // Generate the table on page load
generateTable('p2', 'B',valueB, ['A', 'C','D','E','F'], answerB); // Generate the table on page load
generateTable('p2', 'C',valueC , ['A', 'B','D','E','F'], answerC); // Generate the table on page load

generateTable('p4_1', 'A', valueA, ['B', 'C','D','E','F'], answerA); // Generate the table on page load
generateTable('p4_1', 'B',valueB, ['A', 'C','D','E','F'], answerB); // Generate the table on page load

generateTable('p4_2', 'A', newValueA, ['B', 'C','D','E','F'], newAnswerA); // Generate the table on page load
generateTable('p4_2', 'B',newValueB, ['A', 'C','D','E','F'], newAnswerB); // Generate the table on page load

function validate(pageNo, currNode, values, answers){

  var correct = true;
    for (let j = 0; j < 5; j++) {
      if (values[j])
        continue;
      const inp = document.getElementById(`input_${pageNo}_${currNode}_${j}`);
      if (inp.value.trim() == `${answers[j]}`) {
        inp.style.borderColor = "green";
        inp.style.backgroundColor = "lightgreen";
      } else {
        inp.style.borderColor = "red";
        inp.style.backgroundColor = "lightcoral";
        correct = false;
      }
    }
  return correct;
}
function p2_validateTable() {
  
  const correct1 = validate('p2','B', valueB, answerB);
  const correct2 = validate('p2','C', valueC, answerC);
  const correct = correct1 && correct2;
  setTimeout(function () {
    if (correct) alert("Please proceed to next page");
  }, 300);
}

function p4_validateTable1() {
  let tab2 = document.getElementById("p4_part2").style.display;
  const correct1 = validate('p4_1','A', valueA, answerA);
  const correct2 = validate('p4_1','B', valueB, answerB);
  const correct = correct1 && correct2;
  if(tab2==="none"){
    if(correct){
      document.getElementById("p4_part2").style.display = "block";
    }
    return;
  } 
  
  const correct3 = validate('p4_2','A', newValueA, newAnswerA);
  const correct4 = validate('p4_2','B', newValueB, newAnswerB);
  const correct5 = correct1 && correct2 && correct3 && correct4;
  setTimeout(function () {
    if (correct5) alert("Great! Please proceed to next page");
  }, 600);
}
function p3_validate() {
  let input1 = document.getElementById("p3_input1");
  let input2 = document.getElementById("p3_input2");
  let input3 = document.getElementById("p3_input3");
  let input4 = document.getElementById("p3_input4");
  let input5 = document.getElementById("p3_input5");
  let input6 = document.getElementById("p3_input6");

  let tab2 = document.querySelector(".p3_tab-cont2").style.display;
  let tab3 = document.querySelector(".p3_tab-cont3").style.display;

  function check_input(inp, answer) {
    if (inp.value.trim() === answer) {
      inp.style.borderColor = "green";
      inp.style.backgroundColor = "lightgreen";
      return 1;
    } else {
      inp.style.borderColor = "red";
      inp.style.backgroundColor = "lightcoral";
      return 0;
    }
  }

  if (tab2 === "none") {
    chk = check_input(input1, "4");
    if (chk == 1) {
      document.querySelector(".p3_tab-cont2").style.display = "block";
    }
  } else if (tab3 === "none") {
    chk =
      check_input(input1, "4") &
      check_input(input2, "5") &
      check_input(input3, "6");
    if (chk == 1) {
      document.querySelector(".p3_tab-cont3").style.display = "block";
    }
  } else {
    chk =
      check_input(input1, "4") &
      check_input(input2, "5") &
      check_input(input3, "6") &
      check_input(input4, "2") &
      check_input(input5, "6") &
      check_input(input6, "4");
    setTimeout(function () {
      if (chk == 1) alert("Great! Please proceed to next page");
    }, 300);
  }
}


function p4_validate() {
  let input1 = document.getElementById("p4_input1");
  let input2 = document.getElementById("p4_input2");
  if ((input1.value.trim() == "0") & (input2.value.trim() == "10")) {
    input1.style.borderColor = "green";
    input1.style.backgroundColor = "lightgreen";
    input2.style.borderColor = "green";
    input2.style.backgroundColor = "lightgreen";

    setTimeout(function () {
      alert("Excercise completed");
    }, 300);
  } else {
    input1.style.borderColor = "red";
    input1.style.backgroundColor = "lightcoral";
    input2.style.borderColor = "red";
    input2.style.backgroundColor = "lightcoral";
  }
}
