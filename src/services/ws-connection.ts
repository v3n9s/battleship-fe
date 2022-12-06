import config from '../config';

let ws: WebSocket;

export const getWsConnection = (token: string) => {
  return ws || (ws = new WebSocket(`${config.wsBackendUrl}/?token=${token}`));
};
