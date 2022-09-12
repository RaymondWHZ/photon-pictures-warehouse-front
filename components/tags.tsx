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
  style?: React.CSSProperties
}

export const KitStatusTag: React.FC<KitStatusTagProps> = ({status, style}) => {
  if (status == "available") {
    return <Tag color="default" style={style}>当前可借用</Tag>
  }
  if (status == "in-use") {
    return <Tag color="default" style={style}>可预约</Tag>
  }
  if (status == "unavailable") {
    return <Tag color="default" style={style}>暂不可用</Tag>
  }
  return <Tag style={style}>{status}</Tag>
}
