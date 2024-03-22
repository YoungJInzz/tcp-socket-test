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
    console.log(new Date(), "ON DATA", data.toString("hex"));
    switch (PAYLOAD_UTIL.route(data)) {
      case STD.PAYLOAD_TYPE.START:
        const farm = await PROCESS_METHOD.start(data, socket);
        if (farm) {
          farmHash[farm.code] = socket;
          farmCode = farm.code;
        }
        break;
      case STD.PAYLOAD_TYPE.REALTIME:
        const resultRealTime = await PROCESS_METHOD.realtime(data, socket);
        if (resultRealTime) {
          if (resultRealTime.isResponse) {
            const timestamp = microtime.now();
            const payload = PAYLOAD_UTIL.generateWriteCurrentTimePayload(
              timestamp,
              resultRealTime.farm,
              resultRealTime.FARM_CODE,
              resultRealTime.HOUSE_NUM,
              95
            );
            await writeData(
              resultRealTime.FARM_CODE,
              resultRealTime.HOUSE_NUM,
              timestamp,
              95,
              payload
            );
          }
          await PROCESS_METHOD.dataChange(
            resultRealTime.dataChange,
            resultRealTime.farm,
            resultRealTime.FARM_CODE,
            resultRealTime.HOUSE_NUM,
            writeData
          );
        }
        break;
      case STD.PAYLOAD_TYPE.HOUSE_DATA_NONE_UPDATE:
        await PROCESS_METHOD.houseDataNoneUpdate(data, socket);
        break;
      case STD.MODBUS.WRITE:
        const resultWrite = await PROCESS_METHOD.writeResponseProcess(
          data,
          socket
        );
        if (timestampHash[resultWrite.timestamp]) {
          if (timestampHash[resultWrite.timestamp].instance) {
            clearTimeout(timestampHash[resultWrite.timestamp].instance);
          }
          timestampHash[resultWrite.timestamp].resolve(resultWrite);
        }
        break;
      case STD.MODBUS.READ:
        const resultRead = await PROCESS_METHOD.readResponseProcess(
          data,
          socket
        );
        if (timestampHash[resultRead.timestamp]) {
          if (timestampHash[resultRead.timestamp].instance) {
            clearTimeout(timestampHash[resultRead.timestamp].instance);
          }
          timestampHash[resultRead.timestamp].resolve(resultRead);
        }
        break;
      case STD.PAYLOAD_TYPE.ERROR:
        break;
    }
  });

  socket.on("end", () => {
    console.log("클라이언트 연결 종료");
  });
});

server.listen(3000, () => {
  console.log("서버 실행 중...");
});
