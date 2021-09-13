from ctypes import cdll

libCC = cdll.LoadLibrary('./CC.dll')
libSlipEtc = cdll.LoadLibrary('./slip_etc.dll')


def changeData(isRun, data):
    if isRun:
        # 一键 CC
        if data["isCCRun"]:
            CCdataList = data["damage"] + data["damage"] + \
                data["track"] + data["safe"]
            # 加载参数
            for i in range(4):
                print(i, int(CCdataList[2 * i]), int(CCdataList[2 * i + 1]))
                libCC.dataChange(i, int(CCdataList[2 * i]), int(CCdataList[2 * i + 1]))

            libCC.run()

        # 一键下滑
        if data["isSlipRun"]:
            libSlipEtc.slipRun(True)

        # 下落上翻
        if data["isSlipThenUpRun"]:
            libSlipEtc.slipThenUpRun(True)

        # 小跳
        if data["isLittleJumpRun"]:
            libSlipEtc.littleJumpRun(True)

        # 绳子上下翻
        if data["isSlipAndUpCtnRun"]:
            libSlipEtc.slipUpCtnRun(True)
    else:
        libCC.close()
        libSlipEtc.slipRun(False)
        libSlipEtc.slipThenUpRun(False)
        libSlipEtc.littleJumpRun(False)
        libSlipEtc.slipUpCtnRun(False)
