import express from "express";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const sendCommand = async (command, res, successMessage) => {
  try {
    const response = await fetch(
      `http://192.168.225.50/${command}`
    );
    if (response.ok) {
      res.status(200).json({ message: successMessage });
    } else {
      res
        .status(response.status)
        .json({ message: "Failed to execute command" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// LED control routes
app.post("/:command", async (req, res) => {
  const { command } = req.params;

  const commands = {
    off: "LED is off",
    ani0: "Animation 0",
    ani1: "Animation 1",
    ani2: "Animation 2",
    ani3: "Animation 3",
    ani4: "Animation 4",
    ani5: "Animation 5",
    ani6: "Animation 6",
    ani7: "Animation 7",
    speed1: "Speed 1",
    speed2: "Speed 2",
    speed3: "Speed 3",
    speed4: "Speed 4",
    speed5: "Speed 5",
    speed6: "Speed 6",
    speed7: "Speed 7",
    speed8: "Speed 8",
    speed9: "Speed 9",
    speed10: "Speed 10",
    speed11: "Speed 11",
  };

  console.log(command);
  console.log(commands[command]);

  if (commands[command]) {
    await sendCommand(command, res, commands[command]);
  } else {
    res.status(400).json({ message: "Invalid command" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://127.0.0.1:5000");
});
