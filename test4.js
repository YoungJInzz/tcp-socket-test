const value = 1325;
const hexValue = value.toString(16); // 16진수로 변환
console.log(hexValue);
const buffer = Buffer.from(hexValue, "hex"); // 16진수 값을 가진 버퍼 생성

console.log(buffer); // 버퍼 출력
