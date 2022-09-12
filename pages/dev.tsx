import {PortableText} from "@portabletext/react";
import {useDev} from "../util/services";
import {Skeleton} from "antd";

const Dev = () => {
  const { data: dev } = useDev()

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{ maxWidth: "600px", width: "100%", fontSize: "16px", paddingTop: "50px", paddingBottom: "30px" }}>
        {dev ? <PortableText value={dev}/> : <Skeleton active/>}
      </div>
    </div>
  );
}

export default Dev;
