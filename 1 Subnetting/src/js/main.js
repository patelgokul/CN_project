// alert('working')

function p1_validate() {
  let input1 = document.getElementById("p1_input1");
  let input2 = document.getElementById("p1_input2");
  let input3 = document.getElementById("p1_input3");
  let input4 = document.getElementById("p1_input4");

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

  chk =
    check_input(input1, "100") &
    check_input(input2, "001") &
    check_input(input3, "011") &
    check_input(input4, "111");

  setTimeout(function () {
    if (chk == 1) alert("Please proceed to next page");
  }, 300);
}

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
