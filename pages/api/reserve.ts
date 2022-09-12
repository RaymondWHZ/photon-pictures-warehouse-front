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
    from: {
      email: process.env.SENDGRID_EMAIL,
      name: process.env.SENDGRID_EMAIL_NAME
    },
    personalizations: [
      {
        to: [
          {
            email: reservation.email
          }
        ],
        dynamic_template_data: {
          _id: createdDoc._id,
          kitName: reservation.kitName,
          name: reservation.name,
          email: reservation.email,
          wechat: reservation.wechat,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          project: reservation.project,
          usage: reservation.usage
        }
      }
    ],
    template_id: process.env.SENDGRID_TEMPLATE_ID
  }

  await sgMail.send(msg)

  res.status(200).json({})
}
