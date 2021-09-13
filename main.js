const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray, dialog } = require("electron");

let win, settingWindow, tray, contextMenu;
function createWindow() {
	// 创建浏览器窗口
	win = new BrowserWindow({
		width: 420,
		height: 300,
		resizable: false,
		frame: false,
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	win.loadFile("./html/index.html");
	win.once("ready-to-show", () => {
		win.show();
	});

	// 打开开发者工具
	// win.webContents.openDevTools();

	// 屏蔽菜单栏按键
	win.webContents.setIgnoreMenuShortcuts(true);
}
app.on("ready", () => {
	createWindow();
	// 注册全局快捷键
	globalShortcut.register("Control+F1", () => {
		win.webContents.send("runChange", "run");
	});
	globalShortcut.register("Control+F2", () => {
		win.webContents.send("runChange", "close");
	});
	// 创建托盘菜单
	tray = new Tray("./res/flower.ico");
	contextMenu = Menu.buildFromTemplate([
		{
			label: "启动",
			type: "normal",
			click() {
				win.webContents.send("runChange", "run");
			},
		},
		{
			label: "关闭",
			type: "normal",
			click() {
				win.webContents.send("runChange", "close");
			},
		},
		{ type: "separator" },
		{
			label: "设置",
			type: "normal",
			click() {
				ipcMain.emit("open-setting-window");
			},
		},
		{ type: "separator" },
		{
			label: "退出",
			type: "normal",
			click() {
				app.quit();
			},
		},
	]);
	tray.setToolTip("AutoCC");
	tray.setContextMenu(contextMenu);

	// 点击托盘图标显示程序
	tray.on("click", () => {
		win.show();
	});
});
app.on("window-all-closed", () => {
	app.quit();
});

app.on("quit", () => {
	// 关闭 python 服务端
	const socket = require("net").Socket;
	const client = (name, args, callback) => {
		let s = new socket();
		s.setEncoding = "utf-8";
		s.once("connect", () => {
			s.write(
				JSON.stringify({
					name: name,
					args: args,
				})
			);
		});
		if (typeof callback == "function") {
			s.once("data", (data) => {
				callback(data);
			});
		}
		s.connect(26999, "localhost");
	};
	try {
		client("serverExit", []);
	} catch(e) {}

	// 关闭所有窗口
	win = null;
	settingWindow = null;

	// 注销所有全局快捷键
	globalShortcut.unregisterAll();

	// 销毁托盘图标
	tray.destroy();
});

// 开启 python 服务端
require("child_process").execFile("./res/server.exe");

// 读取配置文件
const fs = require("fs");
function saveConfig() {
	fs.writeFile("./config.json", JSON.stringify(config), () => {});
}
try {
	config = JSON.parse(fs.readFileSync("./config.json"));
} catch (error) {
	config = {
		isDefaultMinToTray: false,
		isDefaultExit: false,
	};
	saveConfig();
}

/**
 * 主窗口
 *
 */

// 监听 frame 按钮
ipcMain.on("close-index-window", () => {
	if (config.isDefaultMinToTray) {
		// 最小化到托盘
		win.hide();
	} else if (config.isDefaultExit) {
		// 直接退出
		app.quit();
	} else {
		// 创建对话框，使用模态框口
		dialog
			.showMessageBox(win, {
				title: "AutoCC",
				icon: "./res/flower.ico",
				cancelId: -1,
				message: "你想要……",
				modal: true,
				checkboxLabel: "记住我的选择",
				buttons: ["最小化到托盘", "退出程序"],
			})
			.then((result) => {
				if (result.response == 0) {
					if (result.checkboxChecked) {
						config.isDefaultMinToTray = true;
						saveConfig();
					}
					win.hide();
				} else if (result.response == 1) {
					if (result.checkboxChecked) {
						config.isDefaultMinToTray = false;
						config.isDefaultExit = true;
						saveConfig();
					}
					app.quit();
				}
			});
	}
});
ipcMain.on("minimize-index-window", () => {
	win.minimize();
});

/**
 * 设置窗口
 */
var isSettingWindowOpen = false;
ipcMain.on("open-setting-window", () => {
	if (isSettingWindowOpen) {
		settingWindow.focus();
		return;
	}

	isSettingWindowOpen = true;

	settingWindow = new BrowserWindow({
		width: 675,
		height: 640,
		resizable: false,
		minimizable: false,
		show: false,
		icon: "./res/flower.ico",
		webPreferences: {
			nodeIntegration: true,
		},
	});
	settingWindow.loadFile("./html/setting.html");
	// 隐藏菜单栏
	Menu.setApplicationMenu(null);
	settingWindow.once("ready-to-show", () => {
		settingWindow.show();
	});
	// 打开开发者工具
	// settingWindow.webContents.openDevTools();

	settingWindow.once("closed", () => {
		isSettingWindowOpen = false;
	});
});
ipcMain.on("close-setting-window", () => {
	settingWindow.close();
});
