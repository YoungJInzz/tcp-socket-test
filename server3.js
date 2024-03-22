const net = require("net");
const { buffer } = require("stream/consumers");

const server = net.createServer((socket) => {});

server.listen(3000, () => {
  console.log("서버 실행 중...");
});
