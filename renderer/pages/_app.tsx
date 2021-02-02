import "antd/dist/antd.css"
import { useEffect } from "react"
import "../../resources/css/tailwind.css"
import { css } from "../utils/stitches.config"
import { useStore } from "../store/index"

css.global({
  "#__next": {
    height: "100%",
  },
})
export default function MyApp({ Component, pageProps }) {
  const { wallet } = useStore()

  useEffect(() => {
    wallet.init()
  }, [])
  return <Component {...pageProps} />
}
