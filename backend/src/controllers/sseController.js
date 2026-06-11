const { addClient, removeClient } = require("../sse/sseManager");

const suscribir = (req, res) => {
  // Headers obligatorios para SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // importante si usas nginx
  res.flushHeaders();

  const clientId = crypto.randomUUID(); // Node 18+, o usa uuidv4()

  addClient(clientId, res);

  // Ping cada 25s para mantener la conexión viva
  const ping = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(ping);
    }
  }, 25000);

  // Cuando el cliente se desconecta (cierra pestaña, etc.)
  req.on("close", () => {
    clearInterval(ping);
    removeClient(clientId);
  });
};

module.exports = { suscribir };
