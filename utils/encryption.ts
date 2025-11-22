import CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES-256
 * @param data - The data to encrypt (object or string)
 * @param secretKey - The user's master password/key
 * @returns The encrypted string (ciphertext)
 */
export const encryptData = (data: any, secretKey: string): string => {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
};

/**
 * Decrypts data using AES-256
 * @param ciphertext - The encrypted string
 * @param secretKey - The user's master password/key
 * @returns The decrypted data (original object/string) or null if failed
 */
export const decryptData = <T>(ciphertext: string, secretKey: string): T | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) return null;

        return JSON.parse(decryptedString) as T;
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};
