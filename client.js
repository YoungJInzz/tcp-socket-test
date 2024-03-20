const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.connect({ port: 3000 }, () => {
  console.log("서버에 연결됨");

  rl.on("line", (input) => {
    client.write(input);
  });
});

client.on("data", (data) => {
  console.log("받은 데이터:", data.toString());
});

client.on("end", () => {
  console.log("서버 연결 종료");
  // rl.close();
  setTimeout(() => {
    // 재연결 시도
    client.connect({ port: 3000 });
  }, 2000); // 1초 후 재연결 시도
});
