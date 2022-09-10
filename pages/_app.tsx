import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "./layout";
import {ConfigProvider} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  )
}

export default MyApp
