// alert("working");

function p1_validate() {
  let input1 = document.getElementById("p1_input1");
  let input2 = document.getElementById("p1_input2");
  let input3 = document.getElementById("p1_input3");
  let input4 = document.getElementById("p1_input4");
  let input5 = document.getElementById("p1_input5");
  let input6 = document.getElementById("p1_input6");
  let input7 = document.getElementById("p1_input7");
  let input8 = document.getElementById("p1_input8");
  let input9 = document.getElementById("p1_input9");

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
    check_input(input1, "2") &
    check_input(input2, "6") &
    check_input(input3, "4") &
    check_input(input4, "6") &
    check_input(input5, "4") &
    check_input(input6, "4") &
    check_input(input7, "3") &
    check_input(input8, "1") &
    check_input(input9, "2");

  setTimeout(function () {
    if (chk == 1) alert("Please proceed to next page");
  }, 300);
}

function p2_validate() {
  let input1 = document.getElementById("p2_input1");
  let input2 = document.getElementById("p2_input2");
  let input3 = document.getElementById("p2_input3");
  let input4 = document.getElementById("p2_input4");
  let input5 = document.getElementById("p2_input5");
  let input6 = document.getElementById("p2_input6");
  let input7 = document.getElementById("p2_input7");
  let input8 = document.getElementById("p2_input8");
  let input9 = document.getElementById("p2_input9");
  let input10 = document.getElementById("p2_input10");
  let input11 = document.getElementById("p2_input11");
  let input12 = document.getElementById("p2_input12");
  let input13 = document.getElementById("p2_input13");
  let input14 = document.getElementById("p2_input14");
  let input15 = document.getElementById("p2_input15");
  let input16 = document.getElementById("p2_input16");
  let input17 = document.getElementById("p2_input17");
  let input18 = document.getElementById("p2_input18");
  let input19 = document.getElementById("p2_input19");
  let input20 = document.getElementById("p2_input20");
  let input21 = document.getElementById("p2_input21");
  let input22 = document.getElementById("p2_input22");
  let input23 = document.getElementById("p2_input23");
  let input24 = document.getElementById("p2_input24");
  let input25 = document.getElementById("p2_input25");

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
    check_input(input1, "5") &
    check_input(input2, "3") &
    check_input(input3, "4") &
    check_input(input4, "1") &
    check_input(input5, "3") &
    check_input(input6, "2") &
    check_input(input7, "3") &
    check_input(input8, "4") &
    check_input(input9, "2") &
    check_input(input10, "4") &
    check_input(input11, "6") &
    check_input(input12, "4") &
    check_input(input13, "4") &
    check_input(input14, "2") &
    check_input(input15, "4") &
    check_input(input16, "4") &
    check_input(input17, "1") &
    check_input(input18, "2") &
    check_input(input19, "3") &
    check_input(input20, "2") &
    check_input(input21, "6") &
    check_input(input22, "3") &
    check_input(input23, "4") &
    check_input(input24, "1") &
    check_input(input25, "2");

  setTimeout(function () {
    if (chk == 1) alert("Please proceed to next page");
  }, 300);
}

function p3_validate() {
  let input1 = document.getElementById("p3_input1");
  let input2 = document.getElementById("p3_input2");

  if (
    (input1.value.trim() == "00") & (input2.value.trim() == "11") ||
    (input1.value.trim() == "11") & (input2.value.trim() == "00")
  ) {
    input1.style.borderColor = "green";
    input1.style.backgroundColor = "lightgreen";
    input2.style.borderColor = "green";
    input2.style.backgroundColor = "lightgreen";

    setTimeout(function () {
      alert("Please proceed to next page");
    }, 300);
  } else {
    input1.style.borderColor = "red";
    input1.style.backgroundColor = "lightcoral";
    input2.style.borderColor = "red";
    input2.style.backgroundColor = "lightcoral";
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
