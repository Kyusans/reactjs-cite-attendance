import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY

// Store encrypted data in localStorage
export const storeData = (key, data) => {
  try {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString()
    localStorage.setItem(key, encrypted)
  } catch (error) {
    console.error(`Failed to store ${key}:`, error)
  }
}

// Retrieve and decrypt data from localStorage
export const retrieveData = (key) => {
  try {
    const cipherText = localStorage.getItem(key)
    if (!cipherText) return null

    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted) || decrypted
  } catch (error) {
    console.error(`Failed to retrieve ${key}:`, error)
    return null
  }
}

// Remove a specific item
export const removeData = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove ${key}:`, error)
  }
}

// Clear all localStorage
export const removeAllData = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
