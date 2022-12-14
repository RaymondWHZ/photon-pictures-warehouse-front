import {PortableText} from "@portabletext/react";
import {Skeleton} from "antd";
import Head from "next/head";
import {fetchDev} from "../util/data-client";
import React from "react";
import {NextPage} from "next";
import {PortableTextBlock} from "@portabletext/types";

export async function getStaticProps() {
  return {
    props: {
      dev: await fetchDev()
    },
    revalidate: 10
  }
}

const Dev: NextPage<{ dev: PortableTextBlock[] }> = ({ dev }) => {
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
