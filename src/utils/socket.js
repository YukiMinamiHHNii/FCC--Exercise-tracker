const io = require("socket.io");

class Socket {
	static handleConnection(server) {
		this.io= io(server);
	}
}

Socket.io = null;

module.exports = { Socket };
