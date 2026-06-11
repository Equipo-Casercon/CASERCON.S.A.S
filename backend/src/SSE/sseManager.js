const clients = new Map(); // clientId → res

const addClient = (clientId, res) => {
    clients.set(clientId, res);
};

const removeClient = (clientId) => {
  clients.delete(clientId);
};

// Emite un evento a TODOS los clientes conectados excepto el emisor
const broadcast = (event, data, excludeClientId = null) => {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res, clientId) => {
    if (clientId !== excludeClientId) {
      try {
        res.write(payload);
      } catch {
        clients.delete(clientId);
      }
    }
  });
};

module.exports = { addClient, removeClient, broadcast };
