const net = require("net");

// 서버 정보
const serverHost = "127.0.0.1";
const serverPort = 3000;

// 연결할 클라이언트 수
const numClients = 300;

// 연결을 시도할 클라이언트 수 만큼 반복
for (let i = 0; i < numClients; i++) {
  // 새로운 소켓 생성
  const client = new net.Socket();

  // 서버에 연결 시도
  client.connect(serverPort, serverHost, function () {
    console.log(`클라이언트 ${i + 1}이 서버에 연결되었습니다.`);
    // 연결이 성공하면 메시지를 서버에 전송
    client.write(`Hello, server! I am client ${i + 1}.`);
  });

  // 서버로부터 데이터를 수신할 때 발생하는 이벤트 핸들러
  client.on("data", function (data) {
    console.log(
      `클라이언트 ${i + 1}이 서버로부터 메시지를 수신했습니다: ${data}`
    );
  });

  // 서버와 연결이 종료될 때 발생하는 이벤트 핸들러
  client.on("close", function () {
    console.log(`클라이언트 ${i + 1}의 연결이 종료되었습니다.`);
  });

  // 에러 처리
  client.on("error", function (err) {
    console.error(`클라이언트 ${i + 1}의 오류:`, err);
  });
}
