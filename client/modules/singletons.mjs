import { io } from "socket.io-client";
import { ModelCache } from "modelCache";

var socket = io();
var modelCache = new ModelCache();

export { socket, modelCache };
