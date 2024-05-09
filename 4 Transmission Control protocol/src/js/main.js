const graphWidth = 300;

let sending = 0;
let countACK = 0;

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
  // var span = document.createElement("span");
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

    // ctx.beginPath();
    // ctx.moveTo(1, 0);
    // ctx.lineTo(1, canvas.height);
    // ctx.moveTo(canvas.width-1, 0);
    // ctx.lineTo(canvas.width-1, canvas.height);
    // ctx.setLineDash([]);
    // ctx.stroke();

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
function btnPress(type) {
  var length = 300;
  // type = 1 -> left
  // type = 0 -> right
  if (type == 1) animateRay(1, 1, -5, length);
  else if (type == 0) animateRay(length, 1, 5, -length, 1);
  else if (type == 2) {
    animateRay(1, 1, -5, length / 2);
  } else if (type == 3) {
    animateRay(length, 1, 5, -length / 2, 1);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendPacket() {
  if (countACK >= 2) return;
  var randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber == 0) randomNumber = 1;
  sending += 1;
  if(sending > 1){
    let li = document.createElement("li");
    let text = document.createTextNode("Packet is still in transit");
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
    sending -= 1;
    return;
  }
  btnPress(randomNumber);
  await delay(1700);
  sending -= 1;
  if (randomNumber == 2) {
    let li = document.createElement("li");
    let text = document.createTextNode("Client's packet did not reach server");
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
    return;
  }
  else if (randomNumber == 1) {
    let li = document.createElement("li");
    let text = document.createTextNode("Client's packet reached server");
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
  }
  randomNumber = Math.floor(Math.random() * 4);
  if (randomNumber == 1 || randomNumber == 2) randomNumber = 0;
  btnPress(randomNumber);
  await delay(1700);
  if (randomNumber == 3) {
    let li = document.createElement("li");
    let text = document.createTextNode("Server's packet did not reach client");
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
    return;
  }
  else if (randomNumber == 0) {
    let li = document.createElement("li");
    let text = document.createTextNode("Server's packet reached client");
    li.appendChild(text);
    let ul = document.getElementById("log");
    ul.appendChild(li);
    countACK++;
  }
  if (countACK == 2) {
    alert("Great work! Please proceed to the next page")
  }
}
