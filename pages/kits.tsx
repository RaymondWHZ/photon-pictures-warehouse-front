import type { NextPage } from 'next'
import {Card, Col, Divider, Row, Typography} from "antd";
import React from "react";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";
import {useAllKits} from "../util/services";
import {KitStatusTag, KitTypeTag} from "../components/tags";
import Head from "next/head";
import styles from "./kits.module.css";
import {KitOverview} from "../util/data-client";

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

const KitCard: React.FC<{ kit: KitOverview, disabled?: boolean }> = ({ kit, disabled }) => {
  return (
    <Link href={`/kit/${kit._id}`}>
      <a style={{ margin: "20px" }}>
        <Card
          hoverable
          cover={
            <div style={{ height: "200px" }}>
              {kit.cover && <img src={kit.cover + '&width=800'} alt="" style={{ height: "200px" }}/>}
            </div>
          }
          style={{ width: "300px", height: "389px", opacity: disabled ? 0.5 : 1 }}
        >
          <Meta
            title={
              <>
                <KitTypeTag type={kit.tags[0]} style={{ marginBottom: "10px" }}/>
                <KitStatusTag status={kit.status} availableNow={kit.current_record_status === 'available'}/>
                <br/>
                <Typography.Text style={{ fontSize: "18px", marginRight: "5px" }}>
                  {kit.name}
                </Typography.Text>
              </>
            }
            description={
              <Typography.Paragraph ellipsis={{ rows: 3 }}>
                {kit.description}
              </Typography.Paragraph>
            }
          />
        </Card>
      </a>
    </Link>
  )
}

const CardGrid: React.FC<{ kits?: KitOverview[] }> = ({ kits }) => {
  return (
    <Row className={styles.cardView} gutter={[8, 8]}>
      {
        kits ?
        kits.map((kit: KitOverview) => (
          <Col key={kit._id} span={24} md={12} lg={8} style={{ display: "flex", justifyContent: "center" }}>
            <KitCard kit={kit} disabled={kit.status == "unavailable"}/>
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
  )
}

const Kits: NextPage = () => {
  const { data: kits } = useAllKits()
  const unAvailableKits = kits?.filter((kit: KitOverview) => kit.status === "inactive")
  console.log(kits)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px" }}>
      <Head>
        <title>光子映画器材库 - 所有器材</title>
      </Head>
      <CardGrid kits={kits?.filter((kit: KitOverview) => kit.status === "active")}/>
      {unAvailableKits && unAvailableKits.length > 0 && (
        <>
          <Divider style={{ marginTop: "50px", marginBottom: "30px" }}>暂不可用器材</Divider>
          <CardGrid kits={unAvailableKits}/>
        </>
      )}
    </div>
  )
}

export default Kits
