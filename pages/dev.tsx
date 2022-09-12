import {PortableText} from "@portabletext/react";
import {useDev} from "../util/services";
import {Skeleton} from "antd";
import Head from "next/head";

const Dev = () => {
  const { data: dev } = useDev()

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>光子映画器材库 - 开发信息</title>
      </Head>
      <div style={{ maxWidth: "600px", width: "100%", fontSize: "16px", paddingTop: "50px", paddingBottom: "30px" }}>
        {dev ? <PortableText value={dev}/> : <Skeleton active/>}
      </div>
    </div>
  );
}

export default Dev;
