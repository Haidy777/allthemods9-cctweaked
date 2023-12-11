import TurtleSlot = turtle.TurtleSlot;

export enum EDirections {
    'n' = 'n',
    's' = 's',
    'e' = 'e',
    'w' = 'w'
}

export interface IPosition {
    x: number
    y: number
    z: number
    dir: EDirections
}

class Bot {
    position: IPosition = {x: 0, y: 0, z: 0, dir: EDirections.n}
    originalPosition: IPosition = {x: 0, y: 0, z: 0, dir: EDirections.n}
    fuelEnabled = true
    debug = false
    movementTracking = false
    movements: { dir?: EDirections, backward?: boolean, up?: boolean, down?: boolean }[] = []

    constructor(position?: IPosition, trackMoving = false, homePosition?: IPosition, debug = false) {
        if (position) {
            this.position = position

            if (homePosition) {
                this.originalPosition = homePosition
            } else {
                this.originalPosition = position
            }
        }

        this.fuelEnabled = turtle.getFuelLevel() !== 'unlimited'

        this.debug = debug
        this.movementTracking = trackMoving
    }

    private checkFuel() {
        if (this.fuelEnabled) {
            if (this.getFuelLevel() === 0) {
                throw 'No Fuel Available'
            }
        }
    }

    private log(txt: string) {
        if (this.debug) {
            print(txt)
        }
    }

    private trackMovement(dir?: EDirections, backward?: boolean, up?: boolean, down?: boolean) {
        if (this.movementTracking) {
            this.movements.push({dir, backward, up, down})
        }
    }

    getFuelLevel() {
        if (this.fuelEnabled) {
            return turtle.getFuelLevel() as number
        }

        return 1 // if fuel is disabled return always 1
    }

    getMaxFuelLevel() {
        if (this.fuelEnabled) {
            return turtle.getFuelLimit() as number
        }

        return 1 // if fuel is disabled return always 1
    }

    needsRefueling() {
        if (this.fuelEnabled) {
            return this.getFuelLevel() === 0
        }

        return false
    }

    forward() {
        this.checkFuel()

        if (turtle.forward()) {
            this.log(`forward - ${this.position.x}/${this.position.y}/${this.position.z} dir: ${this.position.dir}`)

            if (this.position.dir === EDirections.n) {
                this.position.y += 1
                this.trackMovement(EDirections.n)

                return true
            } else if (this.position.dir === EDirections.s) {
                this.position.y -= 1
                this.trackMovement(EDirections.s)

                return true
            } else if (this.position.dir === EDirections.e) {
                this.position.x += 1
                this.trackMovement(EDirections.e)

                return true
            } else if (this.position.dir === EDirections.w) {
                this.position.x -= 1
                this.trackMovement(EDirections.w)

                return true
            }
        }

        throw 'Could not move'
    }

    back() {
        this.checkFuel()

        if (turtle.forward()) {
            this.log(`back - ${this.position.x}/${this.position.y}/${this.position.z} dir: ${this.position.dir}`)

            if (this.position.dir === EDirections.n) {
                this.position.y -= 1
                this.trackMovement(EDirections.n, true)

                return true
            } else if (this.position.dir === EDirections.s) {
                this.position.y += 1
                this.trackMovement(EDirections.s, true)

                return true
            } else if (this.position.dir === EDirections.e) {
                this.position.x -= 1
                this.trackMovement(EDirections.e, true)

                return true
            } else if (this.position.dir === EDirections.w) {
                this.position.x += 1
                this.trackMovement(EDirections.w, true)

                return true
            }
        }

        throw 'Could not move'
    }

    up() {
        this.checkFuel()

        if (turtle.up()) {
            this.log(`up - ${this.position.x}/${this.position.y}/${this.position.z} dir: ${this.position.dir}`)

            this.position.z += 1;
            this.trackMovement(undefined, undefined, true)

            return true
        }

        throw 'Could not move'
    }

    down() {
        this.checkFuel()

        if (turtle.down()) {
            this.log(`down - ${this.position.x}/${this.position.y}/${this.position.z} dir: ${this.position.dir}`)

            this.position.z -= 1;
            this.trackMovement(undefined, undefined, false, true)

            return true
        }
    }

    dig(dir?: 'up' | 'down') {
        if (dir === 'up') {
            return turtle.digUp()
        } else if (dir === 'down') {
            return turtle.digDown()
        }

        return turtle.dig()
    }

    detect(dir?: 'up' | 'down') {
        if (dir === 'up') {
            return turtle.detectUp()
        } else if (dir === 'down') {
            return turtle.detectDown()
        }

        return turtle.detect()
    }

    drop(dir?: 'up' | 'down', count?: number) {
        if (dir === 'up') {
            return turtle.dropUp(count)
        } else if (dir === 'down') {
            return turtle.dropDown(count)
        }

        return turtle.drop(count)
    }

    dropAll(dir?: 'up' | 'down') {
        for (let slot = 1; slot <= 16; slot++) {
            this.selectSlot(slot)

            this.drop(dir)
        }
    }

    suck(dir?: 'up' | 'down', count?: number) {
        if (dir === 'up') {
            return turtle.suckUp(count)
        } else if (dir === 'down') {
            return turtle.suckDown(count)
        }

        return turtle.suck(count)
    }

    left() {
        turtle.turnLeft()

        if (this.position.dir === EDirections.n) {
            this.position.dir = EDirections.w
        } else if (this.position.dir === EDirections.w) {
            this.position.dir = EDirections.s
        } else if (this.position.dir === EDirections.s) {
            this.position.dir = EDirections.e
        } else if (this.position.dir === EDirections.e) {
            this.position.dir = EDirections.n
        }

        return true
    }

    right() {
        turtle.turnRight()

        if (this.position.dir === EDirections.n) {
            this.position.dir = EDirections.e
        } else if (this.position.dir === EDirections.e) {
            this.position.dir = EDirections.s
        } else if (this.position.dir === EDirections.s) {
            this.position.dir = EDirections.w
        } else if (this.position.dir === EDirections.w) {
            this.position.dir = EDirections.n
        }

        return true
    }

    rotate(dir: EDirections) {
        if (this.position.dir === dir) {
            return 0 // early abort
        }

        let rotations = 0

        if (
            (this.position.dir === EDirections.n && dir === EDirections.w) ||
            (this.position.dir === EDirections.e && dir === EDirections.n) ||
            (this.position.dir === EDirections.s && dir === EDirections.e) ||
            (this.position.dir === EDirections.w && dir === EDirections.s)
        ) {
            // counterclockwise turn if only one rotation away
            rotations = -1
            this.left()
        } else {
            while (this.position.dir !== dir) {
                this.right()
                rotations += 1
            }
        }

        return rotations
    }

    goTo(position: IPosition) {
        let movements = 0

        if (this.position.x < position.x) {
            while (this.position.x < position.x) {
                this.rotate(EDirections.w)

                this.forward()

                movements += 1
            }
        } else if (this.position.x > position.x) {
            while (this.position.x > position.x) {
                this.rotate(EDirections.e)

                this.forward()

                movements += 1
            }
        }

        if (this.position.y < position.y) {
            while (this.position.y < position.y) {
                this.rotate(EDirections.s)

                this.forward()

                movements += 1
            }
        } else if (this.position.y > position.y) {
            while (this.position.y > position.y) {
                this.rotate(EDirections.n)

                this.forward()

                movements += 1
            }
        }

        if (this.position.z < position.z) {
            this.down()

            movements += 1
        } else if (this.position.z > position.z) {
            this.up()

            movements += 1
        }

        return movements
    }

    goHome(originalPosition = true) {
        if (originalPosition) {
            // go to the position supplied initially instead of 0,0,0
            return this.goTo(this.originalPosition)
        }

        return this.goTo({x: 0, y: 0, z: 0, dir: EDirections.n})
    }

    backTrackHome() {
        if (this.movementTracking) {
            for (const {dir, backward, up, down} of this.movements.reverse()) {
                if (up) {
                    this.down()
                } else if (down) {
                    this.up()
                } else if (dir) {
                    if (backward) {
                        if (dir === EDirections.n) {
                            this.rotate(EDirections.s)
                            this.back()
                        } else if (dir === EDirections.s) {
                            this.rotate(EDirections.n)
                            this.back()
                        } else if (dir === EDirections.w) {
                            this.rotate(EDirections.e)
                            this.back()
                        } else if (dir === EDirections.e) {
                            this.rotate(EDirections.w)
                            this.back()
                        }
                    } else {
                        if (dir === EDirections.n) {
                            this.rotate(EDirections.s)
                            this.forward()
                        } else if (dir === EDirections.s) {
                            this.rotate(EDirections.n)
                            this.forward()
                        } else if (dir === EDirections.w) {
                            this.rotate(EDirections.e)
                            this.forward()
                        } else if (dir === EDirections.e) {
                            this.rotate(EDirections.w)
                            this.forward()
                        }
                    }
                }
            }

            this.movements = []
        }

        throw 'Movement Tracking not Enabled!'
    }

    calculateDistance(position: IPosition) {
        const distanceX = Math.abs(this.position.x - position.x)
        const distanceY = Math.abs(this.position.y - position.y)
        const distanceZ = Math.abs(this.position.z - position.z)

        return distanceX + distanceY + distanceZ
    }

    destinationReachable(position: IPosition, backtracking = false) {
        const availableFuel = this.getFuelLevel()

        if (backtracking) {
            return this.movements.length <= availableFuel
        }

        const distanceToDestination = this.calculateDistance(position)

        return distanceToDestination <= availableFuel;
    }

    refuelAll() {
        if (this.fuelEnabled) {
            for (let slot = 1; slot <= 16; slot++) {
                this.selectSlot(slot)

                const itemCount = turtle.getItemCount()
                const refuelCount = Math.min(itemCount, this.getMaxFuelLevel() - this.getFuelLevel())

                if (refuelCount > 1) {
                    turtle.refuel(itemCount)
                }
            }

            this.selectSlot(1)
        }
    }

    isInventoryFull() {
        let full = false

        for (let slot = 1; slot <= 16; slot++) {
            if (turtle.getItemCount(slot as TurtleSlot) > 0) {
                full = true
                break
            }
        }

        return full
    }

    selectSlot(slot: number) {
        return turtle.select(slot as TurtleSlot)
    }
}

export default Bot