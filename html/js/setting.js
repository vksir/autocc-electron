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

var vm = new Vue({
	el: "#app",
	data: {
		isDataNotChange: true,
		panels: [
			{ id: "menu1", title: "使用须知", href: "#menu1" },
			{ id: "menu2", title: "一键 CC", href: "#menu2" },
			{ id: "menu3", title: "一键下滑", href: "#menu3" },
			{ id: "menu4", title: "下落上翻", href: "#menu4" },
			{ id: "menu5", title: "小跳", href: "#menu5" },
			{ id: "menu6", title: "绳子上下翻", href: "#menu6" },
		],
		damageBtnTitle: ["自定义", "一档", "二档", "三档", "四档", "五档"],
		isDamageInputBoxDisabled: true,
		data: {
			isCCRun: false,
			isSlipRun: false,
			isSlipThenUpRun: false,
			isLittleJumpRun: false,
			isSlipAndUpCtnRun: false,
			level: 0,
			damage: [0, 0],
			track: [0, 0],
			safe: [0, 0],
		},
	},
	methods: {
		setData() {
			client("getData", [], (data) => {
				this.data = JSON.parse(data.toString());
				// 设置 damag 参数是否可输入
				this.setDamageInputBox();
				this.$watch("data.isCCRun", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.isSlipRun", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.isSlipThenUpRun", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.isLittleJumpRun", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.isSlipAndUpCtnRun", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.level", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.damage", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.track", () => {
					this.isDataNotChange = false;
				});
				this.$watch("data.safe", () => {
					this.isDataNotChange = false;
				});
			});
		},
		initializeData() {
			client("initData", [], (data)=> {
				this.data = JSON.parse(data.toString());
				this.setDamageInputBox();
				alert("初始化参数成功！");
			});
		},
		save() {
			client("data", [JSON.stringify(this.data)]);
		},
		confirm() {
			if (!this.isDataNotChange) {
				let s = new socket();
				s.setEncoding = "utf-8";
				s.on("connect", () => {
					mJson = {
						name: "data",
						args: [JSON.stringify(this.data)],
					};
					s.write(JSON.stringify(mJson));
					this.isDataNotChange = true;
					ipcRenderer.send("close-setting-window");
				});
				s.connect(26999, "localhost");
			} else {
				ipcRenderer.send("close-setting-window");
			}
		},
		cancel() {
			ipcRenderer.send("close-setting-window");
		},
		isActive(index) {
			if (index == 0) {
				return true;
			} else {
				return false;
			}
		},
		levelChange(l) {
			this.data.level = l;
			this.setDamageInputBox();
			switch (l) {
				case 1:
					this.data.damage[0] = 54;
					this.data.damage[1] = 162;
					break;
				case 2:
					this.data.damage[0] = 48;
					this.data.damage[1] = 130;
					break;
				case 3:
					this.data.damage[0] = 48;
					this.data.damage[1] = 120;
					break;
				case 4:
					this.data.damage[0] = 45;
					this.data.damage[1] = 110;
					break;
				case 5:
					this.data.damage[0] = 40;
					this.data.damage[1] = 100;
					break;
			}
		},
		setDamageInputBox() {
			if (this.data.level == 0) {
				this.isDamageInputBoxDisabled = false;
			} else {
				this.isDamageInputBoxDisabled = true;
			}
		},
	},
});

vm.setData();
