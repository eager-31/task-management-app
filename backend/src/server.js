import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import prisma from "./config/prisma.js";
import { initSocket } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

async function startServer() {
  try {
    await prisma.$connect();

    console.log("PostgreSQL connected");

    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();