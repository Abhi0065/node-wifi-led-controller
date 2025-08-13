(function() {
  const getIp = JSON.parse(sessionStorage.getItem("ip"));
  if (getIp) {
    console.log("IP exists");
    return;
  }
  const ip = prompt("Enter your IP");
  sessionStorage.setItem("ip", JSON.stringify(ip));
})()


// Reusable fetch function for LED and speed commands
async function sendCommand(command, bodyData = {}) {
  const ip = JSON.parse(sessionStorage.getItem("ip"));
  try {
    const response = await fetch(`/${command}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip, ...bodyData }),
    });
    if (!response.ok) throw new Error("Request failed");
  } catch (error) {
    console.error("Error executing command:", command, error);
  }
}

// Function to control LEDs with exclusive toggle
async function leds(toggleId, statusId, ledNumber) {
  const toggle = document.getElementById(toggleId);
  const status = document.getElementById(statusId);
  let isOn = sessionStorage.getItem(`ledState${ledNumber}`) === "true";

  if (isOn) {
    toggle.checked = true;
    status.innerText = "State ON";
    await sendCommand(`ani${ledNumber}`);
  }

  toggle.addEventListener("change", async () => {
    if (toggle.checked) {
      // Turn off all other LEDs and update session storage
      for (let i = 0; i <= 7; i++) {
        const otherToggle = document.getElementById(`led${i}`);
        const otherStatus = document.getElementById(`status${i}`);
        if (i !== Number(ledNumber)) {
          otherToggle.checked = false;
          otherStatus.innerText = "State OFF";
          sessionStorage.setItem(`ledState${i}`, "false");
        }
      }

      // Turn on the current LED
      status.innerText = "State ON";
      sessionStorage.setItem(`ledState${ledNumber}`, "true");
      await sendCommand(`ani${ledNumber}`);
    } else {
      // Turn off the current LED
      status.innerText = "State OFF";
      sessionStorage.setItem(`ledState${ledNumber}`, "false");
      await sendCommand("off");
    }
  });
}

// Initialize LEDs
for (let i = 0; i <= 7; i++) {
  leds(`led${i}`, `status${i}`, i.toString());
}

// Speed control setup
const speed = document.getElementById("speed");
const speedStatus = document.getElementById("status-speed");
speed.value = 2;
speedStatus.innerText = speed.value;

const prevSpeed = sessionStorage.getItem("speed");
if (prevSpeed) {
  speed.value = prevSpeed;
  const value = prevSpeed * 10;
  speed.style.background = `linear-gradient(to right, red 0%, orangered ${value}%, #f5f5f5 ${value}%, #f5f5f5 100%)`;
  speedStatus.innerText = prevSpeed;
  sendCommand(`speed${prevSpeed}`);
}

speed.addEventListener("change", async () => {
  const speedValue = (Number(speed.value) + 1).toString();
  const value = speed.value * 10;
  speedStatus.innerText = speed.value;
  speed.style.background = `linear-gradient(to right, red 0%, orangered ${value}%, #f5f5f5 ${value}%, #f5f5f5 100%)`;
  sessionStorage.setItem("speed", speed.value);
  sendCommand(`speed${speedValue}`);
});
