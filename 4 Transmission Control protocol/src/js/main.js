const length = 350;
const graphWidth = length;
const graphHeight = 25;

let sending = 0;
let receiving = 0;
let countACK = 0;
let success = true;
let returnSuccess = true;

const windowSize = 4;
const p2_maxPkt = 10;
var ray_counter = 0;
var last_pkt_sent = 0;
var last_ack_sent = 0;
var last_ack_received = 0;
var max_pkt_sent = 0;
var start = 1;
var end = start + windowSize - 1;
var ack_reached = 0;

var timer_call = 0;
/** 1 on timeout */
var force_resend = false;
const time_out_duration = 30;
var duration = time_out_duration;
var intervalID;


var p3_count = 0;

/**
 * @param {number} win probability of getting 1
 */
function getRandom(win) {
  return Math.random() < win;
}

function logEntry(msg) {
  let li = document.createElement("li");
  let text = document.createTextNode(msg);
  li.appendChild(text);
  let ul = document.getElementById("log");
  ul.appendChild(li);
  li.scrollIntoView();
}


function delay(ms, inc_ray_counter = 0) {
  ray_counter += inc_ray_counter;
  return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * @param {Number} angle in degrees, +ve in anti-clockwise
 * @param {Number} length +ve --> ; -ve <--
 * @param {bool} ack 0: solid line; 1: dotted line
 */
function animateRay(startX, startY, angle, length, ack = 0) {
  // Calculate the end points of the ray
  var cosAngle = Math.cos((angle * Math.PI) / 180);
  var sinAngle = Math.sin((angle * Math.PI) / 180);

  var deltaX = length * cosAngle;
  var deltaY = length * sinAngle;

  var startX2 = startX + deltaX;
  var startY2 = startY - deltaY;

  // Create a canvas element
  var canvas = document.createElement("canvas");
  var div = document.getElementById("canvas");

  canvas.width = graphWidth;
  // canvas.height = Math.abs(length * sinAngle) + 10;
  canvas.height = graphHeight;

  div.style.width = `${canvas.width + 3}px`;
  div.style.borderLeft = "2px";
  div.style.borderRight = "2px";
  div.style.borderTop = "0px";
  div.style.borderBottom = "0px";
  div.style.borderStyle = "solid";

  // console.log(canvas.height);
  div.appendChild(canvas);

  // console.log(length * cosAngle, length * sinAngle);
  // Get the 2D drawing context
  var ctx = canvas.getContext("2d");

  // Set the initial position of the ray
  var progress = 0;
  var currentX = startX;
  var currentY = startY;

  // Animate the ray
  function animate() {
    // Calculate the new position of the ray
    progress += 0.02;
    if (progress > 1) {
      progress = 1;
    }

    currentX = startX + (startX2 - startX) * progress;
    currentY = startY + (startY2 - startY) * progress;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ray
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    if (ack) ctx.setLineDash([10, 5]);
    ctx.stroke();

    // Draw the pointing head
    var directionFlag = 1;
    if (length < 0) directionFlag = -1;

    // define triangle head size
    const a = 10; // height
    const b = 5; // base

    var pt1 = [-a * cosAngle + b * sinAngle, a * sinAngle + b * cosAngle];
    var pt2 = [-a * cosAngle - b * sinAngle, a * sinAngle - b * cosAngle];

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(
      currentX + pt1[0] * directionFlag,
      currentY + pt1[1] * directionFlag
    );
    ctx.lineTo(
      currentX + pt2[0] * directionFlag,
      currentY + pt2[1] * directionFlag
    );
    ctx.closePath();
    ctx.fill();

    // Continue the animation
    if (currentX < canvas.width) {
      requestAnimationFrame(animate);
    }
  }

  // Start the animation
  requestAnimationFrame(animate);
  var br = document.createElement("br");
  div.appendChild(br);
}

/**
 *
 * @param {number} dir 1: -->; 0: <--
 * @param {number} success 1: full; 0: half
 */
async function callAnimateRay(dir, success) {
  if (dir) {
    if (success) animateRay(1, 1, -2, length);
    else animateRay(1, 1, -2, length / 2);
  } else {
    if (success) animateRay(length, 1, 2, -length, 1);
    else animateRay(length, 1, 2, -length / 2, 1);
  }
  return await delay(900 + success * 800);
}


async function doublePkt(idx, send_len, ret_len, pn, an) {
  // Animate the ray
  var progress = 0;
  function animate1() {
    // Calculate the new position of the ray

    var currentX = startX;
    var currentY = startY;

    progress += 0.01;
    // delay(10000);
    if (progress > 1) {
      progress = 1;
    }

    var cosAngle = Math.cos((angle * Math.PI) / 180);
    var sinAngle = Math.sin((angle * Math.PI) / 180);

    var deltaX = len * cosAngle;
    var deltaY = len * sinAngle;

    var startX2 = startX + deltaX;
    var startY2 = startY - deltaY;

    currentX = startX + (startX2 - startX) * progress;
    currentY = startY + (startY2 - startY) * progress;
    // console.log("start", startX, startY);
    // console.log("end", startX2, startY2);
    // console.log(progress);
    // console.log("curr",currentX, currentY);

    // Clear the canvas
    ctx.clearRect(0, 0, send_canvas.width, send_canvas.height);

    // Draw the ray
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    if (ack) ctx.setLineDash([10, 5]);
    ctx.stroke();

    // Draw the pointing head
    var directionFlag = 1;
    if (len < 0) directionFlag = -1;

    // define triangle head size
    const a = 10; // height
    const b = 5; // base

    var pt1 = [-a * cosAngle + b * sinAngle, a * sinAngle + b * cosAngle];
    var pt2 = [-a * cosAngle - b * sinAngle, a * sinAngle - b * cosAngle];

    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(
      currentX + pt1[0] * directionFlag,
      currentY + pt1[1] * directionFlag
    );
    ctx.lineTo(
      currentX + pt2[0] * directionFlag,
      currentY + pt2[1] * directionFlag
    );
    ctx.closePath();
    ctx.fill();

    // Continue the animation
    if (currentX < send_canvas.width) {
      requestAnimationFrame(animate1);
    }
  }

  var progress2 = 0;
  function animate2() {
    // Calculate the new position of the ray

    var currentX2 = startX20;
    var currentY2 = startY20;

    progress2 += 0.01;
    if (progress2 > 1) {
      progress2 = 1;
    }

    var cosAngle2 = Math.cos((angle2 * Math.PI) / 180);
    var sinAngle2 = Math.sin((angle2 * Math.PI) / 180);

    var deltaX2 = len2 * cosAngle2;
    var deltaY2 = len2 * sinAngle2;

    var startX22 = startX20 + deltaX2;
    var startY22 = startY20 - deltaY2;

    currentX2 = startX20 + (startX22 - startX20) * progress2;
    currentY2 = startY20 + (startY22 - startY20) * progress2;

    // Clear the canvas
    ctx2.clearRect(0, 0, return_canvas.width, return_canvas.height);

    // Draw the ray
    ctx2.beginPath();
    ctx2.moveTo(startX20, startY20);
    ctx2.lineTo(currentX2, currentY2);
    if (ack2) ctx2.setLineDash([10, 5]);
    ctx2.stroke();

    // Draw the pointing head
    var directionFlag2 = 1;
    if (len2 < 0) directionFlag2 = -1;

    // define triangle head size
    const a = 10; // height
    const b = 5; // base

    var pt12 = [-a * cosAngle2 + b * sinAngle2, a * sinAngle2 + b * cosAngle2];
    var pt22 = [-a * cosAngle2 - b * sinAngle2, a * sinAngle2 - b * cosAngle2];

    ctx2.beginPath();
    ctx2.moveTo(currentX2, currentY2);
    ctx2.lineTo(
      currentX2 + pt12[0] * directionFlag2,
      currentY2 + pt12[1] * directionFlag2
    );
    ctx2.lineTo(
      currentX2 + pt22[0] * directionFlag2,
      currentY2 + pt22[1] * directionFlag2
    );
    ctx2.closePath();
    ctx2.fill();

    // Continue the animation
    if (currentX2 < return_canvas.width) {
      requestAnimationFrame(animate2);
    }
  }

  // declaring and styling canvas
  {
    // Create a canvas element
    var send_canvas = document.createElement("canvas");
    var return_canvas = document.createElement("canvas");
    var div = document.getElementById("canvas");

    send_canvas.width = graphWidth;
    send_canvas.height = graphHeight;
    send_canvas.id = `send${idx}`;
    send_canvas.style.float = "right";
    return_canvas.width = graphWidth;
    return_canvas.height = graphHeight;
    return_canvas.id = `return${idx}`;
    return_canvas.style.float = "left";

    // console.log("width", send_canvas.width);
    // console.log("height", send_canvas.height);

    div.style.width = `${send_canvas.width + 2}px`;
    div.style.borderLeft = "2px";
    div.style.borderRight = "2px";
    div.style.borderTop = "0px";
    div.style.borderBottom = "0px";
    div.style.borderStyle = "solid";
  }

  {
    // var p1 = document.createElement("canvas");
    // var p2 = document.createElement("canvas");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");

    var ray_name = document.getElementById("ray-name");

    var t1 = document.createElement("h6");
    var t2 = document.createElement("h6");

    var pn1 = document.createTextNode(pn);
    var an2 = document.createTextNode(an);

    t1.style.width = "40px";
    t2.style.width = "40px";
    t1.style.height = "25px";
    t2.style.height = "25px";
    t1.style.margin = "0";
    t2.style.margin = "0";

    t1.style.float = "left";
    t2.style.float = "right";

    t1.appendChild(pn1);
    t2.appendChild(an2);

    span1.style.flexDirection = "row";
    span2.style.flexDirection = "row";

    // var ctx1 = p1.getContext("2d");
    // var ctx2 = p2.getContext("2d");

    // ctx1.font = "40px Arial";
    // ctx2.font = "40px Arial";

    // p1.width = 40;
    // p2.width = 40;
    // p1.height = 30;
    // p2.height = 30;

    // ctx1.fillText(pn,0,20);
    // ctx2.fillText(an,0,20);
  }

  ray_name.appendChild(t1);
  span1.appendChild(send_canvas);
  ray_name.appendChild(t2);
  span2.appendChild(return_canvas);
  div.appendChild(span1);
  div.appendChild(span2);

  t2.scrollIntoView();
  
  var send_ctx = send_canvas.getContext("2d");
  // send ray
  var ctx = send_ctx;
  var startX = 1;
  var startY = 1;
  var angle = -2;
  var len = send_len;
  var ack = 0;
  requestAnimationFrame(animate1);
  // if(send_len == 350)
    //   logEntry(`Sender: Pkt${last_pkt_sent} sent and received by receiver`);
  // else
  //   logEntry(`Sender: Pkt${last_pkt_sent} sent but not received by receiver`);
  

  for(var i = 1 ; i <= p2_maxPkt ; i++){
    p2_head[i - 1].className = '';
    p2_sent[i - 1].innerHTML = i <= max_pkt_sent ? '✔':'';
  }

  await delay(2000, 1);
  
  var return_ctx = return_canvas.getContext("2d");
  var ctx2 = return_ctx;
  var startX20 = length;
  var startY20 = 1;
  var angle2 = 2;
  var len2 = -ret_len;
  var ack2 = 1;
  if (ret_len) {
    requestAnimationFrame(animate2);
    // if(ret_len == 350)
    //   logEntry(`Receiver: ACK${last_ack_sent} sent and received by sender`);
    // else
    //   logEntry(`Receiver: ACK${last_ack_sent} sent but not received by sender`);
    ack_reached = 0;
    await delay(2000, 1);
    ack_reached = ret_len == 350;

    for(var i=1;i<=p2_maxPkt;i++){
      p2_ack[i - 1].innerHTML = i <= last_ack_received ? '✔':'';
    }
  }

  return;
}


async function callDblPkt(success, returnSuccess,resend_pkt_no = 0) {
  
  // timer code
  {
  // if(success&&returnSuccess)
  //   timer_call ++;
  // const countdownDiv = document.getElementById("timer");

  // if(last_ack_sent == last_pkt_sent && returnSuccess && success){
  //   countdownDiv.innerHTML = "--:--";
  //   // return;
  // }
  // else
    {
      // const countdown = setInterval(() => {
      // const minutes = Math.floor(duration / 60);
      // const seconds = duration % 60;
    
      // // countdownDiv.style.color = "black";
      // // countdownDiv.style.opacity = 1;
      // // countdownDiv.innerText = `pkt${last_ack_received + 1} - ${minutes}:${seconds.toString().padStart(2, "0")}`;
    
      // duration--;
    
      // if (duration < 0 || timer_call > last_pkt_sent) {
      //   time_out = 1;
      //   console.log(duration,timer_call,last_pkt_sent);
      //   clearInterval(countdown); // Stop the countdown
      //   // countdownDiv.style.color = "red";
      //   // countdownDiv.textContent = `Countdown finished for pkt${last_ack_received + 1}`;
      //   // setInterval(() => {countdownDiv.style.opacity = (countdownDiv.style.opacity == 0.3) ? 1 : 0.3;},500);
      //         }
      //   }, 1000);

    }
  
  }

  if(resend_pkt_no){
    // success - resent pkt number
    // time_out = 0;
    logEntry(`Sender: Pkt${resend_pkt_no} sent and received by receiver`);
    delay(2000);
    logEntry(`Receiver: ACK${resend_pkt_no} sent and received by sender`);
    last_ack_received = resend_pkt_no;
    last_ack_sent = resend_pkt_no;
    last_pkt_sent = resend_pkt_no;
    max_pkt_sent = max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;
    await doublePkt(
      ray_counter,
      length,
      length,
      ` pkt${resend_pkt_no}`,
      ` ack${resend_pkt_no}`
    );

    
  }

  else if (success) {
    if (returnSuccess) {
      // last_pkt_sent++;
      // last_ack_received = last_ack_sent;
      // last_ack_sent++;
      // await delay(2000);
      logEntry(`Sender: Pkt${++last_pkt_sent} sent and received by receiver`);
      delay(2000);
      logEntry(
        `Receiver: ACK${
          last_pkt_sent == 1 + last_ack_sent ? ++last_ack_sent : last_ack_sent
        } sent and received by sender`
      );
    max_pkt_sent = max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;

      // await delay(2000);
      last_ack_received = last_ack_sent;
      await doublePkt(
        ray_counter,
        length,
        length,
        ` pkt${last_pkt_sent}`,
        ` ack${last_ack_sent}`
      );
    } else {
      // last_pkt_sent++;
      // last_ack_sent++;
      // await delay(2000);
      logEntry(`Sender: Pkt${++last_pkt_sent} sent and received by receiver`);
      delay(2000);
      logEntry(
        `Receiver: ACK${
          last_pkt_sent == 1 + last_ack_sent ? ++last_ack_sent : last_ack_sent
        } sent but not received by sender`
      );

    max_pkt_sent = max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;


      await doublePkt(
        ray_counter,
        length,
        length / 2,
        ` pkt${last_pkt_sent}`,
        ` ack${last_ack_sent}`
      );
    }
  } else {
    // last_pkt_sent++;
    delay(2000);
    logEntry(`Sender: Pkt${++last_pkt_sent} sent but not received by receiver`);
    max_pkt_sent = max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;

    await doublePkt(ray_counter, length / 2, 0, ` pkt${last_pkt_sent}`, ` `);
  }

  return await delay(2000);
}



// function p2_timer(pkt_no, clear = 0) {
//   var duration = 2;
//   const countdownDiv = document.getElementById("timer");

//   if(clear){
//     countdownDiv.innerHTML = "--:--";
//     return;
//   }
  
//   const countdown = setInterval(() => {
//     const minutes = Math.floor(duration / 60);
//     const seconds = duration % 60;

//     countdownDiv.innerText = `pkt${pkt_no} - ${minutes}:${seconds.toString().padStart(2, "0")}`;

//     duration--;

//     if (duration < 0 || timer_call > last_pkt_sent) {
//       console.log(pkt_no,duration,timer_call,last_pkt_sent);
//       clearInterval(countdown); // Stop the countdown
//       countdownDiv.style.color = "red";
//       countdownDiv.textContent = `Countdown finished for pkt${pkt_no}`;
//       // setInterval(() => {countdownDiv.style.opacity = (countdownDiv.style.opacity == 0.3) ? 1 : 0.3;},500);
//     }
//   }, 1000);

  
// }


async function p1_buttonPress(type) {
  if (countACK == 0 && success && returnSuccess) await p1_sendPacket();
  else if (type) {
    if (success && returnSuccess) await p1_sendPacket();
    else logEntry(`ACK${countACK + 1} not received, cannot send next`);
  } else {
    if (success && returnSuccess) logEntry(`ACK${countACK} already received`);
    else await p1_sendPacket();
  }
}


async function p1_sendPacket() {
  if (countACK >= 2) return;
  if (sending || receiving) {
    logEntry("Packet is still in transit");
    return;
  }
  success = getRandom(0.6);
  sending = 1;
  await callAnimateRay(1, success);
  sending = 0;
  if (!success) {
    logEntry("Client's packet did not reach server");
    return;
  } else {
    logEntry("Client's packet reached server");
  }
  returnSuccess = getRandom(0.6);
  receiving = 1;
  await callAnimateRay(0, returnSuccess);
  receiving = 0;
  if (!returnSuccess) {
    logEntry("Server's packet did not reach client");
    return;
  } else {
    logEntry("Server's packet reached client");
    countACK++;
  }
  if (countACK == 2) {
    alert("Great work! Please proceed to the next page");
  }
}


async function p2_buttonPress(type) {

  /* MOVE WINDOW */

  if (!type) {
    if (end <= p2_maxPkt && last_ack_received >= start) {
      start++;
      end++;
      if(end > p2_maxPkt){
        end = p2_maxPkt;
        start = p2_maxPkt - windowSize + 1;
        logEntry("!!Window cannot be moved further!!");
      }


      // if(start > p2_maxPkt)
      // logEntry(`start: ${start}; end: ${end}`);
      logEntry(`New start of window - ${start}`);

    } else {
      logEntry("!!! Invalid move window !!!");
    }
  } 
  
  /* SEND NEW */
  
  else if (type == 1) {
    if (
      (!ack_reached || (last_ack_received < start || start == p2_maxPkt - windowSize + 1)) &&
      last_pkt_sent + 1 <= end &&
      !force_resend
    ) {
      // logEntry(`lps: ${last_pkt_sent}, chk ${last_pkt_sent <= end}`);
      // p2_timer(last_pkt_sent+1);
      success = last_pkt_sent == 0 ? 1 : getRandom(0.6);
      returnSuccess = getRandom(0.7);

      if(!timer_call){
        timer_call++;
        duration = time_out_duration;
        intervalID = setInterval(countdown,1000);
      }

      if(returnSuccess*success && last_ack_received == last_pkt_sent){
        // countdown(1);
        clearInterval(intervalID);
        timer_call = 0;
        force_resend = false;
      }

      // await callDblPkt(success, returnSuccess);

      callDblPkt(success, returnSuccess);
      // callDblPkt(1, 1);
    } else if (force_resend){
      logEntry(`!!!Previous pkts exceded waiting time - Use RESEND!!!`)
    } else if (last_pkt_sent + 1 > end) {
      logEntry(`Sender: Window end reached, cannot send next pkt`);
    // } else if (last_ack_received >= start || !(start == p2_maxPkt - windowSize + 1)) {
    } else if (last_ack_received >= start) {
      logEntry(`ar ${ack_reached}`);
      logEntry(`!!!Please move the window first!!!`);
    }
  } 
  
  /* RESEND */
  else if (type == 2) {
    if(force_resend){
      var resend_input = document.getElementById("resend_pkt");
      var resendPkt = Number(resend_input.value);
      if(resendPkt == last_ack_received + 1 && resendPkt <= max_pkt_sent){
        // console.log("here",resendPkt);
        resend_input.value = `${resendPkt == 10? 10 : resendPkt + 1}`;

        callDblPkt(1,1,resendPkt);
        if(resendPkt == max_pkt_sent){
          // allow send new
          clearInterval(intervalID);
          force_resend = false;
          timer_call = 0;
        }
      } else {
        logEntry("!!!Invalid Pkt RESEND!!!");
      }

    } else {
      logEntry("!!!Invalid RESEND!!!");
    }


  }
  logEntry(`${ray_counter} - s: ${start}; ls: ${last_pkt_sent}; lar: ${last_ack_received};`);

  // p2_window_handler();
  for (var i = 1; i <= p2_maxPkt; i++) {
    if (i == start) p2_head[i - 1].className = "window-start";
    else if (i == end) p2_head[i - 1].className = "window-end";
    else if (i > start && i < end) p2_head[i - 1].className = "window-inside";
    else p2_head[i - 1].className = "";
  }
  // for(var i = start ; i <= end ; i++){
  //   if(i == start) p2_head[i - 1].className = 'window-start';
  //   else if(i == end) p2_head[i - 1].className = 'window-end';
  //   else p2_head[i - 1].className = 'window-inside';
  // }

  if(last_ack_received == p2_maxPkt){
    clearInterval(intervalID);
    start = 100;
    last_ack_received = 100;
    await delay(4000);
    alert("Please proceed to next page...");
  }
}


async function p3_button_press(user,type){

  if(sending){
    logEntry("Invalid Button Press. Please wait.");
    return;
  }

  if(!p3_count){
    if(!user && !type){
      // send syn
      p3_count ++;
      logEntry("Sender: SYN sent");
      sending = 1;
      await callAnimateRay(1,1);
      sending = 0;
      
    }
    else{
      logEntry(`${!user ? "Sender" : "Receiver"}: Invalid Handshake`);
    }
  }
  else if(p3_count == 1){
    if(user && type==1){
      // receiver - synack
      p3_count ++;
      logEntry("Receiver: SYN+ACK sent");
      sending = 1;
      await callAnimateRay(0,1);
      sending = 0;
    }
    else{
      logEntry(`${!user ? "Sender" : "Receiver"}: Invalid Handshake`);
      
    }
  }
  else{
    if(!user && type == 2){
      // sender - ack
      p3_count ++;
      logEntry("Sender: ACK sent");
      sending = 1;
      await callAnimateRay(1,1);
      sending = 0;

      alert("Procede to next page...")
    }
    else{
      logEntry(`${!user ? "Sender" : "Receiver"}: Invalid Handshake`);
    }
  }
  sending = 0;
}

function countdown(){
  duration = duration ? --duration:0;
  force_resend = !duration;


  const countdownDiv = document.getElementById("timer");
  // countdownDiv.textContent = `Time-out in: ${duration} - ${force_resend}`;
  countdownDiv.textContent = `Time-out in: ${duration}`;

  // FOR TIME LOG
  // var timelog = document.getElementById("time-log");
  // let li = document.createElement("li");
  // let text = document.createTextNode(`${duration}`);
  // li.appendChild(text);
  // timelog.appendChild(li);
  // li.scrollIntoView();

}

function p2_window_handler(){
  for(var i=1;i<=p2_maxPkt;i++){
    p2_head[i - 1].className = '';
    p2_sent[i - 1].innerHTML = i <= max_pkt_sent ? '✔':'';
  }

  for(var i=start;i<=end;i++){
    if(i == start) p2_head[i - 1].className = 'window-start';
    else if(i == end) p2_head[i - 1].className = 'window-end';
    else p2_head[i - 1].className = 'window-inside';
  }

  for(var i=1;i<=p2_maxPkt;i++){
    p2_ack[i - 1].innerHTML = i <= last_ack_received ? '✔':'';
  }



}

var p2_head = [];
var p2_sent = [];
var p2_ack = [];

function p2_get_window(){
  for(var i=0;i<p2_maxPkt;i++){
    p2_head.push(document.getElementById(`pkt${i+1}-head`));
    p2_sent.push(document.getElementById(`pkt${i+1}-sent`));
    p2_ack.push(document.getElementById(`pkt${i+1}-ack`));
  }
}

p2_get_window();