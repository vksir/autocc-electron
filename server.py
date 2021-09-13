from myirc import MyIRC
from json import loads, dumps
from data import Data


class Server:
    def __init__(self):
        self.data_obj = Data()

    def run(self, isRun: bool):
        self.data_obj.changeData(isRun=isRun)

    def data(self, mData: str):
        self.data_obj.changeData(data=loads(mData))

    def getData(self):
        return dumps(self.data_obj.data)

    def initData(self):
        self.data_obj.initData()
        return dumps(self.data_obj.data)
    
    def serverExit(self):
        exit()


if __name__ == '__main__':
    s = MyIRC(Server(), port=26999)
    s.run()