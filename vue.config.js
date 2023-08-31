const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  pluginOptions:{
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'electron-init',
        appId: "com.electron.rig-nf-agent-server",
        // description:"物联网小助手",
        copyright: "xxxx",
        directories: {
          output: "./dist_electron"
        },
        extraResources:{
          from:"./resource/",
          to:"resource"
        },
        win: {
          requestedExecutionLevel:"requireAdministrator",
          icon: "./public/favicon.ico",
          target: [
            {
              target: "nsis",
              arch: [
                "x64",
                "ia32"
              ]
            }
          ]
        },
        linux:{
          maintainer:"starnet",
          target:[{
            target: "deb",
          }],
          category:"office",
          icon:'./public/favicon.ico',
        },
        mac: {
          icon: './public/favicon.ico'
        },
        dmg: {
          contents: [
            {
              x: 0,
              y: 0,
              path: "/Application"
            }
          ]
        },
        nsis: {
          oneClick: true,
          guid: "electron-init",
          perMachine: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: false,
          installerIcon: "./public/favicon.ico",
          uninstallerIcon: "./public/favicon.ico",
          installerHeaderIcon: "./public/favicon.ico",
          createDesktopShortcut: false,
          createStartMenuShortcut: false,
          shortcutName: "electron-init",
          runAfterFinish:false,
        },
      }
    }
  }
})
