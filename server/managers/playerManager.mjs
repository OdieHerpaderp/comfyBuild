class PlayerManager {
    players = [];
    removedPlayers = [];

    addPlayer(player) {
        if (this.players.includes(player)) { return false; }
        this.players.push(player);
        return true;
    }

    removePlayer(playerToRemove) {
        if (!this.players.includes(playerToRemove)) { return false; }
        this.players = this.players.filter((player) => player != playerToRemove);
        this.removedPlayers.push(playerToRemove.id);
        return playerToRemove;
    }

    onSocketDisconnect(socket) {
        this.players = this.players.filter((player) => {
            if (player.socket !== socket) return true;
            this.removedPlayers.push(player.id);
            return false;
        });
    }

    getTickData() {
        let result = {
            init: [],
            update: [],
            remove: this.removedPlayers
        };
        this.removedPlayers = [];
        this.players.forEach((player) => {
            let initData = player.getInitData();
            if (initData) { result.init.push(initData); }
            let updateData = player.getUpdateData();
            if (updateData) { result.update.push(updateData); }
        });
        return result;
    }

    getAllData() {
        let result = [];
        this.players.forEach((player) => {
            result.push(player.getAllData());
        });
        return result;
    }
}

const playerManager = new PlayerManager();

export default playerManager;