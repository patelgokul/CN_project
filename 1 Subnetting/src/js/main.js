// alert('working')


function p2_validate() {
  let input = document.getElementById("p2_input");

  if (input.value == 9) {
    input.style.borderColor = "green";
    input.style.backgroundColor = "lightgreen";
    setTimeout(function () {
        alert("Please proceed to next page");;
      }, 300);
    
  } else {
    input.style.borderColor = "red";
    input.style.backgroundColor = "lightcoral";
  }
}

function p3_validate() {
    let input1 = document.getElementById("p3_input1");
    let input2 = document.getElementById("p3_input2"); 

    if((input1.value.trim()=='00' & input2.value.trim()=='11') || (input1.value.trim()=='11' & input2.value.trim()=='00')){
        input1.style.borderColor = "green";
        input1.style.backgroundColor = "lightgreen";
        input2.style.borderColor = "green";
        input2.style.backgroundColor = "lightgreen";

        setTimeout(function () {
            alert("Please proceed to next page");;
          }, 300);

    }
    else{
        input1.style.borderColor = "red";
        input1.style.backgroundColor = "lightcoral";
        input2.style.borderColor = "red";
        input2.style.backgroundColor = "lightcoral";
    }
}

function p4_validate(){
    let input1 = document.getElementById("p4_input1");
    let input2 = document.getElementById("p4_input2"); 
    if((input1.value.trim()=='0' & input2.value.trim()=='10')){
        input1.style.borderColor = "green";
        input1.style.backgroundColor = "lightgreen";
        input2.style.borderColor = "green";
        input2.style.backgroundColor = "lightgreen";

        setTimeout(function () {
            alert("Excercise completed");;
          }, 300);
    } else{
        input1.style.borderColor = "red";
        input1.style.backgroundColor = "lightcoral";
        input2.style.borderColor = "red";
        input2.style.backgroundColor = "lightcoral";
    }
}

const tableBody = document.getElementById('tableBody');

// Define the possible values (replace with your actual values)
const values = [0,0,0,0,1,1,1,1];
const binaries =["000", "001", "010", "011", "100", "101", "110", "111"];
function generateTable() {
  // Randomly shuffle the values array
  console.log("Hi")
  values.sort(() => Math.random() - 0.5);

  // Clear existing table rows
  // tableBody.innerHTML = '';

  // Create table rows with data
  for (let i = 0; i < 4; i++) {
    const tableRow = document.createElement('tr');
    for (let j = 0; j < 2; j++) {
    const cell1 = document.createElement('td');
    const span1 = document.createElement('span');
    span1.textContent = i + (j%2)*4;
    cell1.appendChild(span1);
    tableRow.appendChild(cell1);
    

      const cellValue = values[i + (j%2)*4];
      const cell = document.createElement('td');
      const span = document.createElement('span');
      const inp = document.createElement('input');
      inp.id = `input_${i+(j%2)*4}`;
      
      
      if (cellValue ) {
        // cell.classList.add('user-input');
        span.textContent = binaries[i + (j%2)*4];
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

generateTable(); // Generate the table on page load

function validateTable() {
    var correct = true;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
            if(values[i + (j%2)*4])
                continue;
            const inp = document.getElementById(`input_${i+(j%2)*4}`);
            if (inp.value.trim() === binaries[i+(j%2)*4]) {
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
        if (correct ) alert("Please proceed to next page");
      }, 300);
}