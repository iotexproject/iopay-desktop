import { app } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"
import { antenna, antennaUtils } from "./helpers/antenna"
import path from "path"
import { initIPC } from "./helpers/ipc"

app.antenna = antenna
app.antennaUtils = antennaUtils

const isProd: boolean = process.env.NODE_ENV === "production"

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()
  initIPC()

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "../app/preload.js"),
    },
  })

  if (isProd) {
    await mainWindow.loadURL("app://./home.html")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on("window-all-closed", () => {
  app.quit()
})
