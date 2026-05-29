import { NfsView } from "../services/nfsController.js";

const nfsView = new NfsView();
await nfsView.nfsLoad();
