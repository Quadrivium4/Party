import { io } from "socket.io-client";
import { baseUrl } from "../constants";
const socket = io.connect(baseUrl);
export default socket;