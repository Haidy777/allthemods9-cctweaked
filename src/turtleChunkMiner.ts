import Bot, {EDirections, IPosition} from "./lib/bot";

let lastPosition: IPosition = {x: 0, y: 0, z: 0, dir: EDirections.n}

const LAST_POSITION_FILE = 'lastposition'
let didRestore = false

if (fs.exists(LAST_POSITION_FILE)) {
    const file: FileHandle = fs.open(LAST_POSITION_FILE, 'r') as unknown as FileHandle
    const content = file.readAll() || ''

    file.close()

    if (content) {
        const [x, y, z, dir] = content.split('|')

        lastPosition.x = Number(x)
        lastPosition.y = Number(y)
        lastPosition.z = Number(z)
        lastPosition.dir = dir as EDirections
        didRestore = true
    }
}

const bot = new Bot(lastPosition, false, {x: 0, y: 0, z: 0, dir: EDirections.n}, true)

// Slot 1 Torches & Fuel
// Left of Turtle -> Fuel Chest
// Right of Turtle -> Torch Chest

term.clear()
term.setCursorPos(0, 0)
term.write('Chunk mining Script by Haidy777')
term.setCursorPos(0, 1)
term.write('Current Position:', bot.position.x, 'X', bot.position.y, 'Y', bot.position.z, 'Z', bot.position.dir, 'Direction')

if (!didRestore) {
    if (bot.fuelEnabled && bot.needsRefueling()) {
        term.setCursorPos(0, 2)
        term.write('Place Fuel in first slot and press enter key')

        while (true) {
            const [, keyCode] = os.pullEvent('key')
            //@ts-ignore
            const keyName = keys.getName(keyCode)

            if (keyName === 'enter') {
                break
            }
        }

        bot.selectSlot(1)

        const itemCount = turtle.getItemCount()
        const refuelCount = Math.min(itemCount, bot.getMaxFuelLevel() - bot.getFuelLevel())

        if (refuelCount > 0 && itemCount > 0) {
            turtle.refuel(refuelCount)
        }
    }
} else {
    term.setCursorPos(0, 2)
    term.write('Restoring program...')

    // TODO ?
}

