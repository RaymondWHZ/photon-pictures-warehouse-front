import {Kit} from "../types/types";
import React, {useEffect, useRef} from "react";
import {Card, Skeleton} from "antd";
import {KitImages} from "./images";
import Meta from "antd/lib/card/Meta";
import {KitStatusTag, KitTypeTag} from "./tags";
import {PortableText} from "@portabletext/react";

export interface DescriptionCardProps extends React.ComponentProps<typeof Card> {
  kit: Kit
}

export const DescriptionCard: React.FC<DescriptionCardProps> = (props) => {
  const { kit } = props
  const card = useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)

  useEffect(() => {
    if (card.current) {
      const ro = new ResizeObserver(() => {
        if (card.current) {
          setWidth(card.current.clientWidth + 2)  // +2 to account for border
        }
      })
      ro.observe(card.current)
      return () => ro.disconnect()
    }
  }, [card])

  return (
    <Card
      ref={card}
      cover={
        kit ?
          <KitImages images={kit.images} width={width} height={width / 1.5}/> :
          <div style={{ height: width / 1.5, background: "#f0f0f0" }}/>
      }
      {...props}
    >
      {kit ?
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
        :
        <Skeleton active paragraph={{ rows: 5 }} style={{ marginBottom: "150px" }}/>
      }
    </Card>
  )
}