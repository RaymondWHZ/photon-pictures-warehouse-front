import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "./layout";
import {ConfigProvider} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <Head>
        <title>光子映画器材库</title>
        <link rel="shortcut icon" href="/photon.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  )
}

export default MyApp
