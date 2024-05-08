import {ReservationInfo} from "./data-client";

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendConfirmationEmail(reservation: ReservationInfo, _id: string) {
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
          _id,
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
}