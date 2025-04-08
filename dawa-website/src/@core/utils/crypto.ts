import CryptoJS from 'crypto-js';

const rawKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'default_secret_key';
// Convert the secret key string into a WordArray.
const key = CryptoJS.enc.Utf8.parse(rawKey);

export const encrypt = (text: string): string => {
  // Ensure text is a string.
  const message = String(text);
  // Encrypt using the key as a WordArray.
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB, // or CBC if you want (requires an IV)
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const decrypt = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
