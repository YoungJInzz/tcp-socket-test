const net = require("net");
let connectedSockets = 0;
let lastDate = new Date();

const calculate1ByteChecksumByString = (dataHex) => {
  const dataBuffer = Buffer.from(dataHex, "hex");
  let checksum = 0;
  for (let i = 0; i < dataBuffer.length; i++) {
    checksum += dataBuffer[i];
    checksum &= 0xff;
  }
  return checksum.toString(16);
};

const calculate1ByteChecksumByBuffer = (dataBuffer) => {
  let checksum = 0;
  for (let i = 0; i < dataBuffer.length; i++) {
    checksum += dataBuffer[i];
    checksum &= 0xff;
  }
  return checksum.toString(16);
};

const read16To10 = (buffer) => {
  const arr = {};
  for (let i = 0; i * 2 < buffer.length; i++) {
    arr[i * 2] = [
      buffer.subarray(i * 2, i * 2 + 2).readUInt16BE(),
      buffer.subarray(i * 2, i * 2 + 2),
    ];
  }
  console.log(arr);
};

const server = net.createServer((socket) => {
  connectedSockets++;
  console.log("클라이언트 연결됨");
  setInterval(() => {
    if (connectedSockets > 10) {
      console.log("소켓리셋");
      socket.end();
    }
  }, 600000);

  socket.on("data", async (data) => {
    const str = data.toString("utf8");
    if (
      (str.substring(0, 2) === "ST") &
      (str.substring(6, 17) === "SOHAUNIFARM")
    ) {
      console.log("전원", new Date());
      const buffer = Buffer.from("535430303031303030303332", "hex");
      const checksumbuffer = Buffer.from(
        calculate1ByteChecksumByBuffer(buffer),
        "hex"
      );
      const etxBuffer = Buffer.from("0d0a", "hex");
      const combinedBuffer = Buffer.concat([buffer, checksumbuffer, etxBuffer]);
      console.log("응답 전송", combinedBuffer, new Date());
      socket.write(combinedBuffer);
    } else {
      let currDate = new Date();
      const diffInMilliseconds = Math.abs(lastDate - currDate);
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      console.log("실시간데이터 시간차", diffInSeconds, currDate);
      lastDate = currDate;
      const dataBuffer = data.subarray(20, data.length - 3);
      read16To10(dataBuffer);
    }
  });

  socket.on("end", () => {
    console.log("클라이언트 연결 종료");
  });

  socket.on("error", (err) => {
    console.log("클라이언트 연결 에러", err);
  });
});

server.listen(3000, () => {
  console.log("서버 실행 중...");
});

setInterval(() => {
  server.getConnections((err, count) => {
    connectedSockets = count;
    console.log("현재 연결된 소켓 수:", count);
  });
}, 30000);
