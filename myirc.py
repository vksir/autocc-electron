from socket import socket
from json import loads

class MyIRC:
    def __init__(self, server_obj, host='localhost', port=5000):
        self.server_obj = server_obj
        self.s = socket()
        self.s.bind((host, port))
        self.s.listen(5)
    def run(self):
        """
        {'name': func_name, 'args': [func_args]}
        """
        while True:
            cltSk, addr = self.s.accept()
            mJsonStr = cltSk.recv(1024).decode()
            mDict = loads(mJsonStr)

            func_name = mDict['name']
            func_args = mDict['args']
            func = getattr(self.server_obj, func_name)
            if func:
                result = func(*func_args)
                if result:
                    cltSk.send(result.encode())
            cltSk.close()

if __name__ == '__main__':
    class Server:
        def hello(self, value):
            return 'Hello, %s' % value
    m = MyIRC(Server(), port=26999)
    m.run()