import { useRouter } from 'next/router'
import {
  Breadcrumb
} from "antd";
import Link from "next/link";
import {useKitDetail} from "../../util/services";
import React from "react";
import {ReservationCard} from "../../components/reservations";
import Head from "next/head";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import {DescriptionCard} from "../../components/descriptions";

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
      <div style={{ maxWidth: lg ? "1000px" : "600px", width: "100%"}}>
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
            style={{ width: md ? "600px" : "100%",
                     marginRight: lg ? "30px" : "0px", marginBottom: lg ? "0px" : "30px" }}
          />
          <ReservationCard
            kit={kit}
            reservations={reservations}
            style={{ width: lg ? "370px" : md ? "600px" : "100%" }}
          />
        </div>
      </div>
    </div>
  )
}

export default KitDetail
