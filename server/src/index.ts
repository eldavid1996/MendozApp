import express from "express";
import { createServer } from "http";
import { dynamicRoutes } from "./routes";
import { socketManager } from "./controllers";
import { notFoundHandler } from "./middlewares";
import { PORT, connectMongo, configureCors, executeMigrations } from "./config";

const app = express();

app.use(configureCors);
app.use(express.json());

app.use(dynamicRoutes);

app.use(notFoundHandler);

const server = createServer(app);
//const io =
socketManager(server);

connectMongo()
  .then(executeMigrations)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running at port ${PORT}`));
  });
