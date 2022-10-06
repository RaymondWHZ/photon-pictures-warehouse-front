import type { NextApiRequest, NextApiResponse } from 'next'
import {createReservation} from "../../util/data-client";
import {sendConfirmationEmail} from "../../util/mail";
import {ReservationInfo} from "../../types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reservation = req.body as ReservationInfo
  const id = await createReservation(reservation)
  await sendConfirmationEmail(reservation, id)

  res.status(200).json({})
}
