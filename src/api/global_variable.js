const httpBaseUrl = 'http://127.0.0.1:8087';
//const httpBaseUrl = 'http://192.168.2.104:8087';

const webSocketUrl = 'ws://127.0.0.1:8087/webSocket/admin/';
//const webSocketUrl = 'ws://192.168.2.104:8087/webSocket/admin/';


const webSocket = null;
const webSocketTimeOutObj = null;
const webSocketServerTimeOutObj = null;
const webSocketTimeOut = 8000;
const lockReconnect = false;


export default {
  httpBaseUrl,
  webSocketUrl,
  webSocket,
  webSocketTimeOutObj,
  webSocketServerTimeOutObj,
  webSocketTimeOut,
  lockReconnect,
}
