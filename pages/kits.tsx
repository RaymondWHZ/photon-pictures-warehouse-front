import type { NextPage } from 'next'
import {Card, Col, Row, Typography} from "antd";
import React from "react";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";
import {useAllKits} from "../util/services";
import {KitOverview} from "../types/types";
import {toPlainText} from "@portabletext/react";
import {urlFor} from "../util/images";
import {KitStatusTag, KitTypeTag} from "../components/tags";
import Head from "next/head";
import styles from "./kits.module.css";

const KitCardSkeleton: React.FC = () => (
  <Card
    hoverable
    cover={
      <div style={{ height: "200px", background: "#f0f0f0" }}/>
    }
    style={{ width: "300px", height: "389px", margin: "20px" }}
    loading
  />
)

const KitCard: React.FC<{ kit: KitOverview }> = ({ kit }) => {
  return (
    <Link href={`/kit/${kit._id}`}>
      <a style={{ margin: "20px" }}>
        <Card
          hoverable
          cover={
            <div style={{ height: "200px" }}>
              {kit.cover && <img src={urlFor(kit.cover)} alt="" style={{ height: "200px" }}/>}
            </div>
          }
          style={{ width: "300px", height: "389px" }}
        >
          <Meta
            title={
              <>
                <KitTypeTag type={kit.type} style={{ marginBottom: "10px" }}/>
                <KitStatusTag status={kit.status} availableNow={kit.availableNow}/>
                <br/>
                <Typography.Text style={{ fontSize: "18px", marginRight: "5px" }}>
                  {kit.name}
                </Typography.Text>
              </>
            }
            description={
              <Typography.Paragraph ellipsis={{ rows: 3 }}>
                {kit.description && toPlainText(kit.description)}
              </Typography.Paragraph>
            }
          />
        </Card>
      </a>
    </Link>
  )
}

const Kits: NextPage = () => {
  const { data } = useAllKits()

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>光子映画器材库 - 所有器材</title>
      </Head>
      <Row className={styles.cardView} gutter={[8, 8]}>
        {data ?
          data.map((kit: KitOverview) => (
            <Col key={kit._id} span={24} md={12} lg={8} style={{ display: "flex", justifyContent: "center" }}>
              <KitCard kit={kit}/>
            </Col>
          ))
          :
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Col key={i} span={24} md={12} lg={8} style={{ display: "flex", justifyContent: "center" }}>
              <KitCardSkeleton/>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

export default Kits
