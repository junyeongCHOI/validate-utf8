# ValidateUTF8

ValidateUTF8 is a TypeScript module that provides a simple and efficient way to validate if a given byte buffer is a valid UTF-8 encoded string. This module is useful for various applications where UTF-8 encoding validation is required, such as processing text data from different sources or ensuring data integrity.

## Installation

You can install the ValidateUTF8 module using npm:

```bash
npm install validate-utf8
```

## Usage

To use ValidateUTF8, simply import the module and call the is method with a Uint8Array as the argument. The method returns a boolean indicating whether the buffer is a valid UTF-8 encoded string.

## Example

Here's a basic example of how to use ValidateUTF8:

```typescript
import { ValidateUTF8 } from "validate-utf8";

const reader = new FileReader();
reader.onload = function (event: ProgressEvent<FileReader>) {
  // Example buffer (could be from file read, network, etc.)
  const buffer = new Uint8Array(event.target!.result as ArrayBuffer);
  const isValid = ValidateUTF8.is(buffer);
};
reader.readAsArrayBuffer(file);
```

## API

- **ValidateUTF8.is(buffer: Uint8Array): boolean**
  - buffer (Uint8Array): The byte buffer to validate.
  - Returns: boolean - true if the buffer is a valid UTF-8 encoded string, otherwise false.
