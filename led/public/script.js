const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => console.log("connected!");
ws.onerror = (error) => console.error("WebSocket error:", error);
ws.onclose = () => console.log("disconnected!");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const ledStates = data.ledStates;
  const blinkLedStates = data.blinkLedStates;

  if (ledStates.type === "updateLED") {
    document.getElementById("led1").checked = ledStates["1"];
    document.getElementById("status1").innerText = data.ledStates[1]
      ? "State ON"
      : "State OFF";
    document.getElementById("led2").checked = ledStates["2"];
    document.getElementById("status2").innerText = ledStates["2"]
      ? "State ON"
      : "State OFF";
  }

  if (blinkLedStates.type === "updateBlinkLED") {
    document.getElementById("b-led1").checked = blinkLedStates["1"];
    document.getElementById("b-status1").innerText = blinkLedStates["1"]
      ? "Blinking ON"
      : "Blinking OFF";
    document.getElementById("b-led2").checked = blinkLedStates["2"];
    document.getElementById("b-status2").innerText = blinkLedStates["2"]
      ? "Blinking ON"
      : "Blinking OFF";
  }
};

let timeOut = null;
function leds(toggleId, statusId, ledNumber) {
  const toggle = document.getElementById(toggleId);
  const status = document.getElementById(statusId);
  toggle.addEventListener("change", async () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      const isOn = toggle.checked;
      status.innerText = isOn ? "State ON" : "State OFF";
      let url = `${isOn ? "on" : "off"}${ledNumber}`;
      try {
        history.pushState(null, "", `/${url}`);
        await fetch(`/${url}`, { method: "POST" });
      } catch (error) {
        console.log("Error toggling LED", error);
      }
    }, 100);
  });
}

function blinkLeds(toggleId, statusId, ledNumber) {
  const toggle = document.getElementById(toggleId);
  const status = document.getElementById(statusId);
  toggle.addEventListener("change", async () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      const isOn = toggle.checked;
      status.innerText = isOn ? "Blinking ON" : "Blinking OFF";
      let url = `${isOn ? "blink-on" : "blink-off"}${ledNumber}`;
      try {
        history.pushState(null, "", `/${url}`);
        await fetch(`/${url}`, {
          method: "POST",
        });
      } catch (error) {
        console.log("Error toggling LED", error);
      }
    }, 100);
  });
}

leds("led1", "status1", 1);
leds("led2", "status2", 2);
blinkLeds("b-led1", "b-status1", 1);
blinkLeds("b-led2", "b-status2", 2);


