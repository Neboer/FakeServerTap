
module.exports = function parseOnlinePlayers(message) {
    const regex = /There are (\d+) of a max of (\d+) players online: (.+)$/;

    const match = message.trim().match(regex);
    if (!match) {
        return [];
    }

    const [, , , playerList] = match;
    return playerList.split(', ')
}