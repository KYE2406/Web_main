const base64Key = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=";
const ivString = "iv-123456789012"; // GCM은 12바이트 IV 필요

// 내부 함수: 키 생성
async function getAesKey() {
  const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// 암호화 함수 (평문 → base64 인코딩된 암호문)
async function encryptText(plainText) {
  try {
    const iv = new TextEncoder().encode(ivString);
    const encodedText = new TextEncoder().encode(plainText);
    const key = await getAesKey();

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedText
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    return btoa(String.fromCharCode(...encryptedBytes)); // Base64 인코딩
  } catch (e) {
    console.error("암호화 실패:", e);
    return null;
  }
}

// 복호화 함수 (base64 인코딩된 암호문 → 평문)
async function decryptText(base64CipherText) {
  try {
    const iv = new TextEncoder().encode(ivString);
    const encryptedBytes = Uint8Array.from(atob(base64CipherText), c => c.charCodeAt(0));
    const key = await getAesKey();

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedBytes
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (e) {
    console.error("복호화 실패:", e);
    return null;
  }
}