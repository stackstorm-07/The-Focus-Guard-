const URL = "./model/";

let model, webcam;

const alarm = document.getElementById("alarm");
const statusText = document.getElementById("status");

// Unlock audio on first click
document.body.addEventListener("click", () => {
  alarm.play().then(() => alarm.pause());
});



async function init() {
  statusText.innerText = "Loading model...";

  model = await tmImage.load(
    URL + "model.json",
    URL + "metadata.json"
  );

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam").replaceWith(webcam.canvas);

  statusText.innerText = "Model loaded. Stay focused 👀";
  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const predictions = await model.predict(webcam.canvas);

  predictions.forEach(p => {
    if (p.className === "Distracted" && p.probability > 0.9) { // at 90 percent distraction, alarm is triggered
      statusText.innerText = "🚨 GET BACK TO WORK";
      if (alarm.paused) alarm.play();
    }
  });
}

init();