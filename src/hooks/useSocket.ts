import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined; // == # typeof socket 

const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(`${Config.API_URL}`, {
      transports: ['websocket'],
    //   path: '/socket-io',
    });
  }
  return [socket, disconnect];
};

export default useSocket;