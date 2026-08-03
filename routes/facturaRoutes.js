import { Router } from "express";
import facturaController from "../controllers/facturaController.js";

const router = Router();

router.get("/", facturaController.mostrarInicio);
router.post("/calcular", facturaController.calcularFactura);

export default router;
