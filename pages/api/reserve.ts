import type { NextApiRequest, NextApiResponse } from 'next'
import client from "../../util/client";
import {ReservationInfo} from "../../types/types";

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reservation = req.body as ReservationInfo
  const doc = {
    _type: "reservation",
    kit: {
      _type: "reference",
      _ref: reservation.kitId
    },
    name: reservation.name,
    email: reservation.email,
    wechat: reservation.wechat,
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    project: reservation.project,
    usage: reservation.usage,
    status: 'pending'
  }

  const createdDoc = await client.create(doc)

  const msg = {
    to: reservation.email,
    from: 'wuhaozhen1106@gmail.com',
    subject: '光子映画器材库已收到你的预约',
    text: `
    你的预约已被光子映画器材库收到，内容如下：
    
    预约 ID：${createdDoc._id}
    借用器材：${reservation.kitName}
    借用人：${createdDoc.name}
    借用人邮箱：${createdDoc.email}
    借用人微信号：${createdDoc.wechat}
    所属项目：${createdDoc.project}
    使用场景：${createdDoc.usage}
    起始日期：${createdDoc.startDate}
    结束日期：${createdDoc.endDate}
    
    下一步请联系器材库管理者进行审核，感谢您使用器材库！
    
    光子映画器材库
    `
  }

  await sgMail.send(msg)

  res.status(200).json({})
}
