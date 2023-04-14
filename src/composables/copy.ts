import { ElMessage } from 'element-plus'

export default function useCopy(text: string) {
  const el = document.createElement('input')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  ElMessage.success('Copied')
}
