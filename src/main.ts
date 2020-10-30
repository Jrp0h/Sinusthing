let canvas: HTMLCanvasElement | null = document.querySelector("canvas");
let context = canvas!.getContext("2d");

// go one step of a circle
let intervalStep = (1 / 360);

// Get all inputs
const amp1: HTMLInputElement | null = document.querySelector("#amp1");
const amp2: HTMLInputElement | null = document.querySelector("#amp2");
const amp3: HTMLInputElement | null = document.querySelector("#amp3");

const hz1: HTMLInputElement | null = document.querySelector("#hz1");
const hz2: HTMLInputElement | null = document.querySelector("#hz2");
const hz3: HTMLInputElement | null = document.querySelector("#hz3");

const offset1: HTMLInputElement | null = document.querySelector("#offset1");
const offset2: HTMLInputElement | null = document.querySelector("#offset2");
const offset3: HTMLInputElement | null = document.querySelector("#offset3");

const add: HTMLInputElement | null = document.querySelector("#add");
const holographic: HTMLInputElement | null = document.querySelector("#holo");


function sinus(x: number, amp: number, hz: number): number {
  // Do maths stuff that i stole from stack overflow
  return amp * Math.sin(x * 2 * Math.PI * hz);
}

function clapSin(value: number, max: number): number {
  // Clamp value between 100 - 700
  // by dividing value with max
  // so it's range -1 to 1
  // then add one so it's 0 to 2
  // then divide by 2 so it's 0 to 1
  // then multiply by 600 so it's 0 to 600
  // then add 100 so it's 100 to 700
  return (((value / max) + 1) / 2 * 600) + 100;
}

// For drawing lines
let currentPosition = {x: 0, y: 400};

// Draw
function draw(position: {x: number, y: number}) {
  context!.beginPath();
  context!.moveTo(currentPosition.x, currentPosition.y);
  context!.lineTo(position.x, position.y);
  // context!.arc(position.x, position.y, 0.5, 0, 2 * Math.PI);
  context!.stroke();

  // Set the color after drawing
  // because the first line of each
  // interval shouldn't be drawn
  if (!holographic!.checked) {
    currentPosition = position;
    context!.strokeStyle = "rgba(255, 255, 255, 1)";
  }
  else
    context!.strokeStyle = "rgba(0, 128, 0, 0.5)";

}


// Time
let t = 0;

setInterval(() => {
  context!.clearRect(0, 0, canvas!.width, canvas!.height);
  t += 0.001;

  let amp1Value = parseFloat(amp1!.value);
  let amp2Value = parseFloat(amp2!.value);
  let amp3Value = parseFloat(amp3!.value);

  let hz1Value = parseFloat(hz1!.value);
  let hz2Value = parseFloat(hz2!.value);
  let hz3Value = parseFloat(hz3!.value);

  let offset1Value = parseFloat(offset1!.value);
  let offset2Value = parseFloat(offset2!.value);
  let offset3Value = parseFloat(offset3!.value);

  // Go over 2 intervals at all times
  for (let i = 0; i <= 360 * 2; i++) {

    // get y by intervalStep * i and offset by time
    let pos1 = sinus(t + i * intervalStep, amp1Value, hz1Value + (t * offset1Value));
    let pos2 = sinus(t + i * intervalStep, amp2Value, hz2Value + (t * offset2Value));
    let pos3 = sinus(t + i * intervalStep, amp3Value, hz3Value + (t * offset3Value));

    let pos: {x: number, y: number} = {x: 0, y: 0};

    // Use additiv if requested
    // else use multiply
    // 
    // x is always i / 360 * 400
    // because it should go 2 intervals
    // first interval will be 0 to 400
    // second interval will be 400 to 800
    if (add!.checked) {
      pos = {
        x: i / 360 * 400,
        y: clapSin(pos1 + pos2 + pos3, amp1Value + amp2Value + amp3Value)
      }
    }
    else {
      pos = {
        x: i / 360 * 400,
        y: clapSin(pos1 * pos2 * pos3, amp1Value * amp2Value * amp3Value)
      }
    }

    draw(pos);
  }

  // Disable color after all has been drawn
  // to prevent the first one from being drawn
  context!.strokeStyle = "rgba(255, 255, 255, 0)";
  currentPosition = {x: 400, y: 400};

}, 1);
