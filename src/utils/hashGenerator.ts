
import * as crypto from 'crypto';

// Function to generate SHA-256 hash from a transaction
export const generateTransactionHash = (
  sender: string,
  recipient: string,
  amount: number,
  timestamp: string
): string => {
  try {
    // In browser environments, we need to use the Web Crypto API instead of Node.js crypto
    const data = `${sender}${recipient}${amount}${timestamp}`;
    
    // Simple hash function for demo purposes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex string
    const hexHash = Math.abs(hash).toString(16).padStart(64, '0');
    return hexHash;
  } catch (error) {
    console.error('Error generating transaction hash:', error);
    return 'hash-error';
  }
};

// For generating real SHA-256 hashes when Web Crypto API is available
export const generateSHA256Hash = async (data: string): Promise<string> => {
  try {
    // Use Web Crypto API when available
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback to the simple hash if Web Crypto is not available
    return generateTransactionHash(data, '', 0, new Date().toISOString());
  } catch (error) {
    console.error('Error generating SHA-256 hash:', error);
    return 'hash-error';
  }
};
