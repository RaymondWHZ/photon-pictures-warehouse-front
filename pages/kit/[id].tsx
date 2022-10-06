import { useRouter } from 'next/router'
import {
  Breadcrumb
} from "antd";
import Link from "next/link";
import {useKitDetail} from "../../util/services";
import React from "react";
import {ReservationCard} from "../../components/reservations";
import Head from "next/head";
import {DescriptionCard} from "../../components/descriptions";
import styles from "./kit.module.css";
import {NextPage} from "next";

const KitDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useKitDetail(id as string)
  const { kit, reservations } = data ?? {}

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <Head>
        <title>{`光子映画器材库 - ${ kit?.name ?? "器材" }`}</title>
      </Head>
      <div className={styles.contentDiv}>
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
        <div className={styles.cardFlex}>
          <DescriptionCard
            className={styles.description}
            kit={kit}
          />
          <ReservationCard
            className={styles.reservation}
            kit={kit}
            reservations={reservations}
          />
        </div>
      </div>
    </div>
  )
}

export default KitDetail
