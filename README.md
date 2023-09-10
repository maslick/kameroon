# 🇨🇲 Kameroon 🇨🇲
QR/bar code scanner as a Service

[![Build Status](https://github.com/maslick/kameroon/actions/workflows/master.yml/badge.svg)](https://github.com/maslick/kameroon/actions/workflows/master.yml)


## 💡 Demo
* Scanner: https://kameroon.web.app
* React demo: https://kameroon-demo.web.app
* Pure JS demo: https://kameroon-demo-js.web.app

## 🚀 Features
### QR/Barcode support
* Linear product: UPC-A, UPC-E, EAN-8, EAN-13, DATABAR, ISBN
* Linear industrial: CODE-128, CODE-39, CODE-93, CODABAR, DATABAR, ITF-14, I25
* Matrix: QR code, Micro QR Code, Aztec, DataMatrix, PDF417

### Security
* We never store your users' QR codes
* Beside using HTTPS, the resulting QR codes are additionally encrypted (assymetric RSA-OAEP)
* We do not store encryption keys

### Developer support
* Javascript helper [library ](https://github.com/maslick/kameroon-lib)
* [React.js](https://github.com/maslick/kameroon-demo) and [vanilla JS](https://github.com/maslick/kameroon-demo-js) examples

## 🔭 References
* https://github.com/maslick/koder
* https://github.com/maslick/kameroon-demo
* https://github.com/maslick/kameroon-demo-js
* https://github.com/maslick/kameroon-lib

## 🙏 Credits
We appreciate the open-source community for their contributions. **Kameroon** uses:

- [ZXing-C++](https://github.com/zxing-cpp/zxing-cpp) (C++ port of ZXing) under [Apache License 2.0](https://github.com/zxing-cpp/zxing-cpp/blob/master/LICENSE).

Contribute to the [original repository](https://github.com/zxing-cpp/zxing-cpp) for ZXing-C++ improvements.
