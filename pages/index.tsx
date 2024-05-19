import {Affix, Button, Divider, Skeleton} from "antd";
import Link from "next/link";
import Head from "next/head";
import React from "react";
import styles from "./index.module.css"
import {fetchManual} from "../util/data-client";
import {NextPage} from "next";
import type {NotionPageContent} from "notion-cms-adaptor";
import {NotionPageContentRenderer} from "../components/text";

export async function getStaticProps() {
  return {
    props: {
      manual: await fetchManual()
    },
    revalidate: 10
  }
}

const Home: NextPage<{ manual: NotionPageContent }> = ({ manual }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>光子映画器材库 - 使用须知</title>
      </Head>
      <div className={styles.contentDiv}>
        {manual ?
          <>
            <div style={{ maxWidth: "600px", fontSize: "16px", paddingTop: "30px" }}>
              <span style={{ fontSize: "28px", fontWeight: "bold" }}>器材库使用须知</span>
              <Divider/>
              <NotionPageContentRenderer value={manual}/>
            </div>
            <Affix offsetBottom={0}>
              <div className={styles.actionPanel}>
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
