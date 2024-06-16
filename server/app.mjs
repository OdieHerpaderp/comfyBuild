import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import serverSettings from './serverSettings.mjs';
import ComfyBuildServer from './comfyBuildServer.mjs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/',function(req, res) {
	res.sendFile(path.join(__dirname + '/../client/indexthreejs.html'));
});
app.use('/client',express.static(path.join(__dirname + '/../client')));
app.use('/lib',express.static(path.join(__dirname + '/../lib')));
app.use('/node_modules',express.static(path.join(__dirname + '/../node_modules')));

server.listen(serverSettings.port, () => { console.log("Server listening on port " + serverSettings.port)});

const comfyBuildServer = new ComfyBuildServer(io);

// New implementation that doesn't rely on raf
const targetTickTime = 1000 / serverSettings.targetTickRate; // Target frame time in milliseconds
let lastFrameTime = Date.now();

function gameLoop() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastFrameTime;

  if (elapsedTime >= targetTickTime) {
    comfyBuildServer.gameTick();
    lastFrameTime = currentTime;
  }

  setTimeout(gameLoop, targetTickTime);
}

gameLoop();