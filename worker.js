// worker.js
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env["NEXT_PUBLIC_CONVEX_URL"]);

// client.query(api.songs.getSongs).then(console.log);

if (isMainThread) {
  // This part runs in the main thread
  console.log("Main thread");

  // Create a new worker thread
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: "woker",
  });

  // Listen for messages from the worker thread
  worker.on("message", async (message) => {
    setInterval(async () => {
      const songs = await client.query(api.songs.getSongs);
      if (!songs.length) return;
      const process = songs[0].process;
      console.log(process);
      await client.mutation(api.songs.update, {
        id: songs[0]._id,
        process: process + 1,
      });
      if (process + 1 >= songs[0].duration) {
        await client.mutation(api.songs.update, {
          id: songs[0]._id,
          isArchived: true,
        });
      }
    }, [1000]);
  });
} else {
  // This part runs in the worker thread
  console.log("Worker thread");

  // Receive data from the main thread
  const dataFromMain = workerData;

  // Do some processing with the data
  const result = dataFromMain.toUpperCase();

  // Send the result back to the main thread
  parentPort.postMessage(result);
}
