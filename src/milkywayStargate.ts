import * as basalt from './lib/basalt'

interface SGJourneyBasicInterface extends AnyPeripheral {
    getEnergy(): number

    disconnectStargate(): boolean

    getChevronsEngaged(): number

    getOpenTime(): number

    getStargateEnergy(): number

    isStargateConnected(): number

    engageSymbol(symbol: number): number // not available on milkyway gate
    endRotation(): boolean

    getRotation(): number

    getCurrentSymbol(): number

    isCurrentSymbol(symbol: number): boolean

    lowerChevron(): boolean

    raiseChevron(): boolean

    rotateAntiClockwise(symbol: number): boolean

    rotateClockwise(symbol: number): boolean
}

function dial(address: number[], isMilkywayGate = true) {
    const start = gate.getChevronsEngaged()

    for (let i = start; i < address.length; i++) {
        const chevron = address[i]

        if(isMilkywayGate){
            if (i % 2 === 0) {
                gate.rotateClockwise(chevron)
            } else {
                gate.rotateAntiClockwise(chevron)
            }

            while (!gate.isCurrentSymbol(chevron)) {
                sleep(0)
            }

            sleep(1)

            gate.raiseChevron()

            sleep(1)

            gate.lowerChevron()
        } else {
            gate.engageSymbol(chevron)
        }

        sleep(1)
    }
}

const [gate] = peripheral.find<SGJourneyBasicInterface>("basic_interface")
const monitorSide = 'right'
const monitorFrame = basalt.addMonitor()

monitorFrame.setMonitor(monitorSide)