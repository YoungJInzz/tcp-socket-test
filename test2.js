// Example data for MODBUS function code 03 (read holding registers)
const modbusFunctionCode = 0x03; // Function code 03 for reading holding registers
const startingAddress = 0x0000; // Starting address to read from
const quantity = 10; // Number of registers to read

// Calculate CRC16 function
function calculateCRC16(buffer) {
  let crc = 0xffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ 0xa001;
      } else {
        crc = crc >> 1;
      }
    }
  }
  return crc;
}

// Function to create MODBUS request buffer with CRC16
function createModbusRequestWithCRC(functionCode, startingAddr, quantity) {
  const buffer = Buffer.alloc(8); // Allocate buffer of size 8 bytes
  buffer.writeUInt8(functionCode, 0); // Write function code at index 0
  buffer.writeUInt16BE(startingAddr, 1); // Write starting address at index 1 as big-endian
  buffer.writeUInt16BE(quantity, 3); // Write quantity at index 3 as big-endian
  const crc = calculateCRC16(buffer.slice(0, 6)); // Calculate CRC16 for the buffer
  buffer.writeUInt16LE(crc, 6); // Write CRC16 at the end of the buffer as little-endian
  return buffer;
}

// Create MODBUS request buffer with CRC16
const modbusRequestBufferWithCRC = createModbusRequestWithCRC(
  modbusFunctionCode,
  startingAddress,
  quantity
);

// Print hexadecimal representation of the request buffer with CRC16
console.log(modbusRequestBufferWithCRC.toString("hex"));
