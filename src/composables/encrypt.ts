import JSEncrypt from 'jsencrypt'

export function useEncrypt(text: string) {
  const encryptText = ref<string | boolean>('')
  const PUBLIC_KEY = import.meta.env.VITE_PASSWORD_PUBLIC_KEY
  const RSAEncrypt = new JSEncrypt()
  RSAEncrypt.setPublicKey(PUBLIC_KEY)
  encryptText.value = RSAEncrypt.encrypt(text)
  return encryptText
}
