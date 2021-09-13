const { ipcRenderer } = require("electron");
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

let runBtn = document.getElementById("runBtn");
let settingBtn = document.getElementById("settingBtn");
let minimizeBtn = document.getElementById("minimizeBtn");
let exitBtn = document.getElementById("exitBtn");

var isCCRun = false;

function changeRun() {
	if (!isCCRun) {
		// 改变按钮外观
		runBtn.innerHTML = "AutoCC is Running...";
		runBtn.classList.add("flow-sun");
		isCCRun = true;
	} else {
		runBtn.innerHTML = "START";
		runBtn.classList.remove("flow-sun");
		isCCRun = false;
	}

	client("run", [isCCRun]);
}

ipcRenderer.on("runChange", (event, args) => {
	if (args == "run") {
		if (!isCCRun) {
			changeRun();
		}
	} else {
		if (isCCRun) {
			changeRun();
		}
	}
});

minimizeBtn.addEventListener("click", () => {
	ipcRenderer.send("minimize-index-window");
});

exitBtn.addEventListener("click", () => {
	ipcRenderer.send("close-index-window");
});

// 设置按钮
settingBtn.addEventListener("click", () => {
	ipcRenderer.send("open-setting-window");
});
