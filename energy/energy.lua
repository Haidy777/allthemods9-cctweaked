local monitorSide = "right"
local mainEnergyStorageSide = "left"

local basalt = require("basalt")

local monitorFrame = basalt.addMonitor()

monitorFrame:setTheme({ FrameBG = colors.lightGray, FrameFG = colors.black })
monitorFrame:setMonitor(monitorSide)

-- MAINPAGE
local mainPage = monitorFrame:addFrame():setPosition(1, 1):setSize("{parent.w}", "{parent.h}")

local header = mainPage:addLabel():setPosition(1, 1):setText("Energy Monitor")

local mainStorageFrame = mainPage:addFrame():setPosition(2, 2):setSize("{parent.w - 2}", "{parent.h - 2}")
local mainStorageLabel = mainStorageFrame:addLabel():setPosition(1, 1):setText("Main Storage Level")
local mainStorageProgressBar = mainStorageFrame:addProgressbar():setPosition(1,2)
mainStorageProgressBar:setProgressBar(colors.blue)

-- MAINPAGE

local mainEnergyStorage = peripheral.wrap(mainEnergyStorageSide)

basalt.debug(mainEnergyStorage.getMethods())

local mainEnergyStorageMax = mainEnergyStorage.getEnergyCapacity()

local function backgroundEnergyCheck()
    while true do
        basalt.debug(mainEnergyStorage.getEnergy() / mainEnergyStorageMax * 100)
        mainStorageProgressBar:setProgress(mainEnergyStorage.getEnergy() / mainEnergyStorageMax * 100)

        sleep(10)
    end
end

local backgroundEnergyCheckThread = monitorFrame:addThread()

backgroundEnergyCheckThread:start(backgroundEnergyCheck)

basalt.autoUpdate()