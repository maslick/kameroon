function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export async function createKeys() {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function saveKeysToLocalStorage(keys) {
  try {
    const {privateKey, publicKey} = keys;

    const exportedPrivateKey = await exportPrivateKeyToBase64(privateKey);
    const exportedPublicKey = await exportPublicKeyToBase64(publicKey);

    // Store the encrypted private key and expiration timestamp in localStorage
    const ttlSeconds = 3600; // 1 hour
    const expirationTimestamp = Date.now() + ttlSeconds * 1000;
    localStorage.setItem('privateKeyBase64', exportedPrivateKey);
    localStorage.setItem('publicKeyBase64', exportedPublicKey);
    localStorage.setItem('ttl', expirationTimestamp.toString());
  }
  catch (e) {
    console.error(e);
  }
}

export async function fetchKeysFromLocalStorage() {
  const privateKeyBase64 = localStorage.getItem('privateKeyBase64');
  if (privateKeyBase64 === null)
    throw new Error("private key not found");
  const publicKeyBase64 = localStorage.getItem('publicKeyBase64');
  if (publicKeyBase64 === null)
    throw new Error("public key not found");
  const keyExpiration = parseInt(localStorage.getItem('ttl'));
  if (Date.now() < keyExpiration) {
    return {privateKey: await importPrivateKey(privateKeyBase64), publicKey: publicKeyBase64};
  } else {
    throw new Error("keys expired");
  }
}

export async function exportPublicKeyToBase64(publicKey) {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return exportedAsBase64;
}

export async function exportPrivateKeyToBase64(privateKey) {
  const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const exportedPrivateKeyAsString = ab2str(exportedPrivateKey);
  const exportedPrivateKeyAsBase64 = window.btoa(exportedPrivateKeyAsString);
  return exportedPrivateKeyAsBase64;
}

export async function importPublicKey(pem) {
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pem);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

export async function importPrivateKey(pem) {
  const binaryDerString = window.atob(pem);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export async function encryptMessage(publicKeyBase64, message) {
  const publicKey = await importPublicKey(publicKeyBase64);
  return await window.crypto.subtle.encrypt(
    {name: "RSA-OAEP"},
    publicKey,
    new TextEncoder().encode(message)
  );
}

export async function decryptMessage(privateKey, encryptedMessage) {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedMessage
  );
  return new TextDecoder().decode(decryptedMessage);
}

export function encodeEncryptedMessageAsBase64(encryptedMessage) {
  return window.btoa(ab2str(encryptedMessage));
}

export function decodeBase64EncryptedMessage(base64encodedMessage) {
  return str2ab(window.atob(base64encodedMessage));
}