const graphWidth = 300;

let sending = 0;
let receiving = 0;
let countACK = 0;
let success = 1;
let returnSuccess = 1;

function animateRay(startX, startY, angle, length, ack = 0) {
  /*
    length < 0 : motion from right to left
    length > 0 : motion from left to right

    ack = 1 : dotted line
    ack = 0 : solid line
   */

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
  div.style.width = `${canvas.width + 3}px`;
  div.style.borderLeft = "2px";
  div.style.borderRight = "2px";
  div.style.borderTop = "0px";
  div.style.borderBottom = "0px";
  div.style.borderStyle = "solid";
  div.style.borderTopColor = "black";
  div.style.borderBottomColor = "black";

  canvas.width = graphWidth;
  canvas.height = Math.abs(length * sinAngle) + 10;

  console.log(canvas.height);
  div.appendChild(canvas);

  console.log(length * cosAngle, length * sinAngle);
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
    var checker = progress * 100 * ack;
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

// Example usage:
async function callAnimateRay(dir, success) {
  var length = 300;
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if(dir ){
    if(success)
      animateRay(1, 1, -5, length);
    else
      animateRay(1, 1, -5, length/2);
  }
  else{
    if(success)
      animateRay(length, 1, 5, -length, 1);
    else  
    animateRay(length, 1, 5, -length/2, 1);
  }
  return await delay(900+success*800);
}



function getRandom(){
  return Math.random() < 0.8;
}

function logEntry(msg){
  let li = document.createElement("li");
  let text = document.createTextNode(msg);
  li.appendChild(text);
  let ul = document.getElementById("log");
  ul.appendChild(li);
}

async function sendPacket() {
  if (countACK >= 2) return;
  if(sending || receiving){
    logEntry("Packet is still in transit");
    return;
  }
  success = getRandom();
  sending = 1;
  await callAnimateRay(1,success);
  sending = 0;
  if (!success) {
    logEntry("Client's packet did not reach server");
    return;
  }
  else {
    logEntry("Client's packet reached server");
  }
  returnSuccess = getRandom();
  receiving = 1;
  await callAnimateRay(0, returnSuccess);
  receiving = 0;
  if (!returnSuccess) {
    logEntry("Server's packet did not reach client");
    return;
  }
  else {
    logEntry("Server's packet reached client");
    countACK++;
  }
  if (countACK == 2) {
    alert("Great work! Please proceed to the next page")
  }
}

async function buttonPress(type){
  if(countACK == 0 && success && returnSuccess)
    await sendPacket();
  else if(type){
    if(success && returnSuccess)
      await sendPacket();
    else
      logEntry(`ACK${countACK+1} not received, cannot send next`);
  }
  else{
    if(success && returnSuccess)
      logEntry(`ACK${countACK} already received`);
    else
      await sendPacket();
  }
}