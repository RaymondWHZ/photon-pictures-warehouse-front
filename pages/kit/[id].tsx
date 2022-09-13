import { useRouter } from 'next/router'
import {
  Breadcrumb,
  Card
} from "antd";
import Link from "next/link";
import {useKitDetail} from "../../util/services";
import React from "react";
import {Kit} from "../../types/types";
import {PortableText} from "@portabletext/react";
import Meta from "antd/lib/card/Meta";
import {ReservationCard} from "../../components/reservations";
import {KitImages} from "../../components/images";
import {KitStatusTag, KitTypeTag} from "../../components/tags";
import Head from "next/head";

const DescriptionCard: React.FC<{ kit: Kit }> = ({ kit }) => {
  return (
    <Card
      loading={!kit}
      cover={kit && <KitImages images={kit.images} width="600px" height="400px"/>}
      style={{ width: "600px", marginRight: "30px" }}
    >
      {kit &&
        <Meta
            title={
              <>
                <KitTypeTag type={kit.type} style={{ marginBottom: "10px" }}/>  <KitStatusTag status={kit.status}/> <br/>
                <span style={{ fontSize: "24px", marginRight: "5px" }}>{kit.name}</span>
              </>
            }
            description={
              <div style={{ fontSize: "15px", color: "black" }}>
                <PortableText value={kit.description}/>
              </div>
            }
        />
      }
    </Card>
  )
}



const KitDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useKitDetail(id as string)
  const { kit, reservations } = data ?? {}

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Head>
        <title>光子映画器材库 - { kit?.name ?? "器材" }</title>
      </Head>
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <Breadcrumb style={{ paddingBottom: "20px" }}>
          <Breadcrumb.Item>
            <Link href={"/kits"}>
              <a>
                所有器材
              </a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            { kit?.name ?? "器材" }
          </Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ display: "flex" }}>
          <DescriptionCard kit={kit}/>
          <ReservationCard kit={kit} reservations={reservations} style={{ width: "370px" }}/>
        </div>
      </div>
    </div>
  )
}

export default KitDetail
