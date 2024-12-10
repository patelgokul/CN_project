{
  // let sending = 0;
  // let receiving = 0;
  // let countACK = 0;
  // let success = true;
  // let returnSuccess = true;
  // const windowSize = 4;
  // const p2_maxPkt = 10; 
  // const p4_maxPkt = 8;
  // var p4_windowSize = 1;
  // const p5_maxPkt = 10;
  // var p5_windowSize = 4;
  // var last_pkt_sent = 0;
  // var last_ack_sent = 0;
  // var last_ack_received = 0;
  // var max_pkt_sent = 0;
  // var window_start = 1;
  // var window_end;
  // var ack_reached = 0;
  
  // var timer_call = 0;
  // /** 1 on timeout */
  // var force_resend = false;
  // var force_window_change = false;
  // const time_out_duration = 5;
  // var duration = time_out_duration;
  // var intervalID;
  // var p3_count = 0;
  
  // var window_operations = [];
  // var p5_window_size_trigger = 0; // for add 1 and div 2
  // var p5_window_pos_trigger = 0; // for move window
  // var p7_window_size_trigger = 0; // for add 1 and div 2
  // var p7_window_pos_trigger = 0; // for move window
}
const length = 350;
const graphWidth = length;
const graphHeight = 25;
var ray_counter = 0;
var end_ = 0;


/**
 * @param {number} win probability of getting 1
 */
function getRandom(win) {
  return Math.random() < win;
}

function logEntry(msg, bold= false) {
  let li = document.createElement("li");
  let text = document.createTextNode(msg);
  li.appendChild(text);
  if(bold) li.style.fontWeight = "bold";
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

async function doublePkt(idx, send_len, ret_len, pkt_no, ack_no) {


  // ack_reached = 0;
  // Animate the ray
  var progress = 0;
  function animate1() {
    if(progress == 0){
      logEntry(`${pkt_no} @ ${format_time(secondsElapsed)}`);
    }
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
  var animate2_completion = 0;
  function animate2() {
    // Calculate the new position of the ray
    if(animate2_completion == 0 && progress2 == 1 && pong_success < 3){
      animate2_completion = 1;
      if (ret_len == length){
        logEntry(`${ack_no} @ ${format_time(secondsElapsed)}`,true);
        pong_success++;
        if(pong_success == 3){
          setTimeout(() => end_ = 1, 3000);
          setTimeout(() => alert("!!! Completed Sucessfully !!!"),500)

        }
      }
      
    }

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

    div.style.width = `${send_canvas.width + 2}px`;
    div.style.borderLeft = "2px";
    div.style.borderRight = "2px";
    div.style.borderTop = "0px";
    div.style.borderBottom = "0px";
    div.style.borderStyle = "solid";
  }

  {
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");

    var ray_name = document.getElementById("ray-name");

    var t1 = document.createElement("h6");
    var t2 = document.createElement("h6");

    var pn1 = document.createTextNode(pkt_no);
    var an2 = document.createTextNode(ack_no);

    t1.style.width = "40px";
    t2.style.width = "40px";
    t1.style.height = "25px";
    t2.style.height = "25px";
    t1.style.margin = "0";
    t2.style.margin = "0";

    t1.style.float = "left";
    t2.style.float = "left";

    t1.appendChild(pn1);
    t2.appendChild(an2);

    span1.style.flexDirection = "row";
    span2.style.flexDirection = "row";

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

  }
  return;
}

async function callDblPkt(success, returnSuccess, resend_pkt_no = 0) {
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
  var lar = last_ack_received;
  if (resend_pkt_no) {
    // success - resent pkt number
    // time_out = 0;
    logEntry(`Sender: Pkt${resend_pkt_no} sent and received by receiver`);
    delay(2000);
    logEntry(`Receiver: ACK${resend_pkt_no} sent and received by sender`);
    last_ack_sent = resend_pkt_no;
    last_pkt_sent = resend_pkt_no;

    if(document.title == "GBN - Sender") last_ack_received = resend_pkt_no;

    lar = resend_pkt_no;
    await doublePkt(
      ray_counter,
      length,
      length,
      ` pkt${resend_pkt_no}`,
      ` ack${resend_pkt_no}`
    );
    max_pkt_sent = max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;
  } else if (success) {
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
      max_pkt_sent =
        max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;

      // await delay(2000);
      if(document.title == "GBN - Sender" || document.title == "AIMD" || p7_docTitle == "AIMD") last_ack_received = last_ack_sent;
      lar = last_ack_sent;
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

      max_pkt_sent =
        max_pkt_sent > last_pkt_sent ? max_pkt_sent : last_pkt_sent;

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
  if(document.title != "GBN - Sender" && !(document.title == "AIMD" || p7_docTitle == "AIMD")) last_ack_received = lar;
  return await delay(2000);
}
var ping_counter = 0;
var pong_counter = 0;
var pong_success = 0;

function p1_buttonPress(){
    if(end_) return;
    if(!secondsElapsed){
      start_timer();
    }
    // var send_success = 1
    // var return_success = 1
    var send_success = ping_counter > 4 ? getRandom(0.9) : getRandom(0.5);
    var return_success = pong_counter  > 4 ? getRandom(0.9) : getRandom(0.4);
    if (send_success){
      if (return_success){
        doublePkt(ray_counter,length,length,`PING_${++ping_counter}`,`PONG_${++pong_counter}`);
        // pong_success++;
        // if(pong_success == 3){
        //   setTimeout(() => end_ = 1, 3000);
        //   alert("!!! Completed Sucessfully !!!")

        // }
      }
      else{
        doublePkt(ray_counter,length,length/2,`PING_${++ping_counter}`,`PONG_${++pong_counter}`);
      }
    }
    else{
      doublePkt(ray_counter,length/2,0,`PING_${++ping_counter}`,``);
    }


}

function format_time(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
}


var secondsElapsed = 0;
function start_timer(){
  timer = setInterval(() => {
    if (end_ == 1){
        clearInterval(timer);
    }
    else {
        secondsElapsed++;
        var time_field = document.getElementById('timer');
        time_field.innerHTML = `Timer: ${format_time(secondsElapsed)}`;
    }
    }, 1000);

}
