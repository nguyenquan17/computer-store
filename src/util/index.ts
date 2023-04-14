import JSEncrypt from 'jsencrypt'

export function encryptPassword(pass: string): string | boolean {
  const PUBLIC_KEY = import.meta.env.VITE_PASSWORD_PUBLIC_KEY
  const RSAEncrypt = new JSEncrypt()
  RSAEncrypt.setPublicKey(PUBLIC_KEY)
  return RSAEncrypt.encrypt(pass)
}
