function route(payload) {
  if (!startCode.equals(parseStartBuffer(payload))) {
    console.log("route error", "startCode");
    return STD.PAYLOAD_TYPE.ERROR;
  }
  if (!endCode.equals(parseEndBuffer(payload))) {
    console.log("route error", "endCode");
    return STD.PAYLOAD_TYPE.ERROR;
  }
  if (!checksum(payload.slice(0, -3)).equals(payload.slice(-3, -2))) {
    console.log("route error", "checksum");
    return STD.PAYLOAD_TYPE.ERROR;
  }
  if (payload.length === 21 && payload.slice(6, 14).toString() === "SOHA-SPC") {
    console.log("route", STD.PAYLOAD_TYPE.START);
    return STD.PAYLOAD_TYPE.START;
  }
  const addressBuffer = parseAddressBuffer(payload);
  if (realTimeAddress.equals(addressBuffer)) {
    console.log("route", STD.PAYLOAD_TYPE.REALTIME);
    return STD.PAYLOAD_TYPE.REALTIME;
  }
  const modbusId = parseModbusId(payload);
  const modbusCommand = parseModbusCommand(payload);
  if (readCommand.equals(modbusCommand)) {
    console.log("modbusId", modbusId, "read success");
    return STD.MODBUS.READ;
  } else if (writeCommand.equals(modbusCommand)) {
    console.log("modbusId", modbusId, "write success");
    return STD.MODBUS.WRITE;
  }
  return STD.PAYLOAD_TYPE.ERROR;
}
