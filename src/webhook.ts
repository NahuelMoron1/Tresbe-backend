import { exec } from "child_process";
import express from "express";

const router = express.Router();

router.post("/github-webhook", (req, res) => {
  // Opcional: validar el secret si lo pusiste en GitHub
  console.log("Webhook recibido de GitHub");

  exec(
    "cd /home/tresbedistribuidora/htdocs/api.tresbedistribuidora.com/Tresbe-Backend && git pull origin main && npm install --production && pm2 restart mi-backend",
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error ejecutando deploy");
      }
      console.log(stdout);
      res.send("Deploy realizado correctamente");
    }
  );
});

export default router;
