import Bot, {EDirections} from "./lib/bot";

const bot = new Bot(undefined, true, undefined, true)

// Digs are 3x1 tunnel for 16 blocks

term.clear()

print('Position', bot.position.x, bot.position.y, bot.position.z, bot.position.dir)

bot.up()

for (let i = 0; i < 16; i++) {
    if (bot.detect()) {
        bot.dig()
    }

    if (bot.detect('up')) {
        bot.dig('up')
    }

    if (bot.detect('down')) {
        bot.dig('down')
    }

    if (bot.isInventoryFull()) {
        break
    }
}

bot.backTrackHome()
bot.rotate(EDirections.n)
bot.dropAll()
