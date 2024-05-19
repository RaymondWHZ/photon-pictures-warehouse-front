import React, {useEffect, useRef} from "react";
import {Card, Skeleton} from "antd";
import {KitImages} from "./images";
import Meta from "antd/lib/card/Meta";
import {KitStatusTag, KitTypeTag} from "./tags";
import {Kit} from "../util/data-client";
import {NotionPageContentRenderer} from "./text";
import {TypeWithContent} from "notion-cms-adaptor";

export interface DescriptionCardProps extends React.ComponentProps<typeof Card> {
  kit?: TypeWithContent<Kit, 'content'>
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
                  <KitTypeTag type={kit.tags[0]} style={{ marginBottom: "10px" }}/>
                  <KitStatusTag status={kit.status} availableNow={kit.current_record_status === 'available'}/>
                  <br/>
                  <span style={{ fontSize: "24px", marginRight: "5px" }}>{kit.name}</span>
                </>
              }
              description={
                <div style={{ fontSize: "15px", color: "black" }}>
                  <NotionPageContentRenderer value={kit.content}/>
                </div>
              }
          />
        :
        <Skeleton active paragraph={{ rows: 5 }} style={{ marginBottom: "150px" }}/>
      }
    </Card>
  )
}