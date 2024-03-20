const net = require("net");
const readline = require("readline");
const { buffer } = require("stream/consumers");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const calculate1ByteChecksumByString = (dataHex) => {
  const dataBuffer = Buffer.from(dataHex, "hex");
  let checksum = 0;
  for (let i = 0; i < dataBuffer.length; i++) {
    checksum += dataBuffer[i];
    checksum &= 0xff; // 1바이트로 유지
  }
  return checksum.toString(16);
};

const calculate1ByteChecksumByBuffer = (dataBuffer) => {
  let checksum = 0;
  for (let i = 0; i < dataBuffer.length; i++) {
    checksum += dataBuffer[i];
    checksum &= 0xff; // 1바이트로 유지
  }
  return checksum.toString(16);
};

const server = net.createServer((socket) => {
  console.log("클라이언트 연결됨");

  socket.on("data", async (data) => {
    const buffer0 = data.subarray(0, 50);
    const buffer1 = data.subarray(0, 21);
    const buffer2 = data.subarray(22);
    console.log(0, data.toString("hex"));
    // console.log(1111, buffer1);
    // console.log(2222, buffer2);
    console.log(333, data.toString("utf8"));
    // const combinedBuffer = Buffer.concat([buffer1, buffer2]);

    // socket.write('서버로부터 받은 데이터: ' + data);
  });
  rl.on("line", (input) => {
    const buffer = Buffer.from("5354ffffffff303030303131", "hex");
    const checksumbuffer = Buffer.from(
      calculate1ByteChecksumByBuffer(buffer),
      "hex"
    );
    const etxBuffer = Buffer.from("0d0a", "hex");
    const combinedBuffer = Buffer.concat([buffer, checksumbuffer, etxBuffer]);
    console.log("전송", combinedBuffer);
    socket.write(combinedBuffer);
  });

  socket.on("end", () => {
    console.log("클라이언트 연결 종료");
  });
});

server.listen(3000, () => {
  console.log("서버 실행 중...");
});
