import {PortableText} from "@portabletext/react";
import {useManual} from "../util/services";
import {Affix, Button, Divider, Skeleton} from "antd";
import Link from "next/link";
import Head from "next/head";
import React, {useMemo} from "react";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const Home = () => {
  const { data: manual } = useManual()
  const { lg } = useBreakpoint()

  const actionPanelStyle: React.CSSProperties = useMemo(() => {
    return lg ?
      { position: "fixed", top: "42%", left: "50%", paddingLeft: "175px", width: "475px" } :
      { padding: "30px", paddingTop: "60px",
        backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 100%)" }
  }, [lg])

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>光子映画器材库 - 使用须知</title>
      </Head>
      <div style={{ maxWidth: lg ? "950px" : "600px", width: "100%" }}>
        {manual ?
          <>
            <div style={{ maxWidth: "600px", fontSize: "16px", paddingTop: "30px" }}>
              <span style={{ fontSize: "28px", fontWeight: "bold" }}>器材库使用须知</span>
              <Divider/>
              <PortableText value={manual}/>
            </div>
            <Affix offsetBottom={0}>
              <div style={
                {
                  display: "flex", flexDirection: "column", alignItems: "center",
                  ...actionPanelStyle
                }
              }>
                <Link style={{ maxWidth: "300px", width: "100%" }} href={"/kits"}>
                  <a style={{ maxWidth: "300px", width: "100%" }}>
                    <Button style={{ maxWidth: "300px", width: "100%", marginBottom: "6px" }} type="primary" size="large">
                      进入器材库
                    </Button>
                  </a>
                </Link>
                <span style={{ fontSize: "12px", color: "gray" }}>
                进入器材库前请先仔细阅读使用须知
              </span>
              </div>
            </Affix>
          </>
          :
          <Skeleton active/>
        }
      </div>
    </div>
  )
}

export default Home
