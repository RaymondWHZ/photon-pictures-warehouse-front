import React from "react";
import {Tag} from "antd";

export interface KitTypeTagProps {
  type: string
  style?: React.CSSProperties
}

export const KitTypeTag: React.FC<KitTypeTagProps> = ({type, style}) => {
  if (type == "audio") {
    return <Tag color="blue" style={style}>音频类</Tag>
  }
  if (type == "lighting") {
    return <Tag color="gold" style={style}>灯光类</Tag>
  }
  if (type == "video") {
    return <Tag color="volcano" style={style}>视频类</Tag>
  }
  return <Tag style={style}>{type}</Tag>
}

export interface KitStatusTagProps {
  status: string
  availableNow: boolean
  style?: React.CSSProperties
}

export const KitStatusTag: React.FC<KitStatusTagProps> = ({status, availableNow, style}) => {
  if (status == "unavailable") {
    return <Tag color="default" style={style}>器材暂不可用</Tag>
  }
  if (status == "available") {
    if (availableNow) {
      return <Tag color="default" style={style}>当前可借用</Tag>
    } else {
      return <Tag color="default" style={style}>可预约</Tag>
    }
  }
  return <Tag style={style}>{status}</Tag>
}
