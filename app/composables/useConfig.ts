export function useConfig() {
  const appConfig = useAppConfig()

  const device = useState('config-device', () => {
    let ua = ''
    if (import.meta.server) {
      const headers = useRequestHeaders(['user-agent'])
      ua = headers['user-agent'] || ''
    } else {
      ua = navigator.userAgent
    }
    return {
      isMobile: /Mobile|Android|iPhone|iPod/i.test(ua),
    }
  })

  return {
    site: appConfig.site,
    device: device.value,
  }
}
