import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import facturaRoutes from "./routes/facturaRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de vistas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", facturaRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
