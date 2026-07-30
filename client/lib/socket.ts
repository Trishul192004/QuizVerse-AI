import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/lib/config";

export const socket = io(SOCKET_BASE_URL,
  {
    autoConnect: false,
  }
);