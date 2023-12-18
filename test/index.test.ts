import * as fs from "fs";
import * as path from "path";
import { ValidateUTF8 } from "../src";

describe("ValidateUTF8", () => {
  test("valid single-byte characters (ASCII)", () => {
    expect(ValidateUTF8.is(new Uint8Array([0x00]))).toBeTruthy();
    expect(ValidateUTF8.is(new Uint8Array([0x7f]))).toBeTruthy();
  });

  test("valid two-byte characters", () => {
    expect(ValidateUTF8.is(new Uint8Array([0xc2, 0x80]))).toBeTruthy();
    expect(ValidateUTF8.is(new Uint8Array([0xdf, 0xbf]))).toBeTruthy();
  });

  test("valid three-byte characters", () => {
    expect(ValidateUTF8.is(new Uint8Array([0xe0, 0xa0, 0x80]))).toBeTruthy();
    expect(ValidateUTF8.is(new Uint8Array([0xef, 0xbf, 0xbf]))).toBeTruthy();
  });

  test("valid four-byte characters", () => {
    expect(
      ValidateUTF8.is(new Uint8Array([0xf0, 0x90, 0x80, 0x80]))
    ).toBeTruthy();
    expect(
      ValidateUTF8.is(new Uint8Array([0xf4, 0x8f, 0xbf, 0xbf]))
    ).toBeTruthy();
  });

  test("invalid sequences", () => {
    // Invalid first byte
    expect(ValidateUTF8.is(new Uint8Array([0x80]))).toBeFalsy();
    expect(ValidateUTF8.is(new Uint8Array([0xff]))).toBeFalsy();

    // Invalid continuation bytes
    expect(ValidateUTF8.is(new Uint8Array([0xc2, 0x7f]))).toBeFalsy();
    expect(ValidateUTF8.is(new Uint8Array([0xe0, 0xa0, 0x7f]))).toBeFalsy();

    // Overlong encoding
    expect(ValidateUTF8.is(new Uint8Array([0xc0, 0x80]))).toBeFalsy(); // Overlong NUL

    // Code points over the maximum Unicode value
    expect(
      ValidateUTF8.is(new Uint8Array([0xf4, 0x90, 0x80, 0x80]))
    ).toBeFalsy();

    // Reserved UTF-16 surrogates
    expect(ValidateUTF8.is(new Uint8Array([0xed, 0xa0, 0x80]))).toBeFalsy(); // High surrogates
    expect(ValidateUTF8.is(new Uint8Array([0xed, 0xbf, 0xbf]))).toBeFalsy(); // Low surrogates
  });

  test("validate UTF-8 from file", () => {
    const filePath = path.join(__dirname, "./files/utf8.txt");

    const data = fs.readFileSync(filePath);

    const buffer = new Uint8Array(data);
    const isValid = ValidateUTF8.is(buffer);
    expect(isValid).toBeTruthy();
  });

  test("validate UTF-8 from invalid file", () => {
    const filePath = path.join(__dirname, "./files/gb18030.txt");

    const data = fs.readFileSync(filePath);

    const buffer = new Uint8Array(data);
    const isValid = ValidateUTF8.is(buffer);
    expect(isValid).toBeFalsy();
  });
});
