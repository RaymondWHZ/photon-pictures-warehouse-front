import {PortableText} from "@portabletext/react";
import {useSettings} from "../util/services";
import {Button, Divider, Skeleton} from "antd";
import Link from "next/link";

export default () => {
  const { data: settings } = useSettings()

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        {settings ?
          <>
            <div style={{ width: "600px", fontSize: "16px", paddingTop: "30px" }}>
              <span style={{ fontSize: "28px", fontWeight: "bold" }}>器材库使用须知</span>
              <Divider/>
              <PortableText value={settings.manual}/>
            </div>
            <div style={{ position: "fixed", top: "42%", left: "50%", paddingLeft: "200px", width: "500px",
              display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Link style={{ width: "100%" }} href={"/kits"}>
                <a style={{ width: "100%" }}>
                  <Button style={{ width: "100%", marginBottom: "6px" }} type="primary" size="large">
                    进入器材库
                  </Button>
                </a>
              </Link>
              <span style={{ fontSize: "12px", color: "gray" }}>
                进入器材库前请先仔细阅读使用须知
              </span>
            </div>
          </>
          :
          <Skeleton/>
        }
      </div>
    </div>
  )
}
