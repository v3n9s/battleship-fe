export default {
  httpBackendUrl: `http://${process.env.BACKEND_URL as string}`,
  wsBackendUrl: `ws://${process.env.BACKEND_URL as string}`,
};
