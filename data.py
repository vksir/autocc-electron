from main import changeData
from json import dumps, loads

class Data:
    data = {}
    __isRun = False

    def __init__(self, isRead=True):
        try:
            with open('data.json', 'r') as f:
                self.data = loads(f.read())
        except FileNotFoundError:
            self.data = self.__initData()
            self.__saveData()

    def __initData(self):
        data = {
            'isCCRun': True,
            'isSlipRun': True,
            'isSlipThenUpRun': True,
            'isLittleJumpRun': True,
            'isSlipAndUpCtnRun': True,
            'level': 3,
            'damage': [48, 120],
            'track': [35, 200],
            'safe': [60, 200],
        }
        return data

    def __saveData(self):
        with open('data.json', 'w') as f:
            f.write(dumps(self.data))

    def changeData(self, isRun=None, data=None):
        if isRun != None:
            self.__isRun = isRun
        if data != None:
            self.data = data
            self.__saveData()
        changeData(self.__isRun, self.data)


if __name__ == '__main__':
    cfg = Data()
    cfg.changeData(__isRun=True)
    import time
    time.sleep(1000)
