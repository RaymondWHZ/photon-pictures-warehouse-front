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
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

interface DescriptionCardProps {
  kit: Kit
  style?: React.CSSProperties
  imageWidth?: any
  imageHeight?: any
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ kit, style, imageWidth, imageHeight }) => {
  return (
    <Card
      loading={!kit}
      cover={kit && <KitImages images={kit.images} width={imageWidth} height={imageHeight}/>}
      style={style}
    >
      {kit &&
        <Meta
            title={
              <>
                <KitTypeTag type={kit.type} style={{ marginBottom: "10px" }}/>
                <KitStatusTag status={kit.status} availableNow={kit.availableNow}/>
                <br/>
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
  const { md, lg } = useBreakpoint()

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>{`光子映画器材库 - ${ kit?.name ?? "器材" }`}</title>
      </Head>
      <div style={{ maxWidth: lg ? "1000px" : md ? "600px" : "400px", width: "100%"}}>
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
        <div style={{ display: "flex", flexDirection: lg ? "row" : "column" }}>
          <DescriptionCard
            kit={kit}
            style={{ width: md ? "600px" : "400px",
                     marginRight: lg ? "30px" : "0px", marginBottom: lg ? "0px" : "30px" }}
            imageWidth={ md ? "600px" : "400px" }
            imageHeight={ md ? "400px" : "266px" }
          />
          <ReservationCard
            kit={kit}
            reservations={reservations}
            style={{ width: lg ? "370px" : md ? "600px" : "400px" }}
          />
        </div>
      </div>
    </div>
  )
}

export default KitDetail
