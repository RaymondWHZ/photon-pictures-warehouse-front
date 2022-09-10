import type { NextPage } from 'next'
import {Card, Col, Row, Spin, Typography} from "antd";
import React from "react";
import Meta from "antd/lib/card/Meta";
import Link from "next/link";
import {useAllKits} from "../util/services";
import {KitOverview} from "../types/types";
import {toPlainText} from "@portabletext/react";
import {urlFor} from "../util/utils";
import {KitStatusTag, KitTypeTag} from "../components/tags";

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
                <KitTypeTag type={kit.type} style={{ marginBottom: "10px" }}/> <br/>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", marginRight: "5px" }}>{kit.name}</span>
                  <KitStatusTag status={kit.status}/>
                </div>
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

const Home: NextPage = () => {
  const { data } = useAllKits()
  if (!data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
        <Spin size="large"/>
      </div>
    )
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Row gutter={[8, 8]} style={{ maxWidth: "1000px", flex: 1 }}>
        {data.map((kit: KitOverview) => (
          <Col key={kit._id} span={24} md={12} lg={8} style={{ display: "flex", justifyContent: "center" }}>
            <KitCard kit={kit}/>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
