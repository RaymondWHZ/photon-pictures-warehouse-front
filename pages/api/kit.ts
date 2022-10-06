import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchKitAndReservations} from "../../util/data-client";
import {Kit, ReservationSlot} from "../../types/types";

type Data = {
  kit: Kit,
  reservations: ReservationSlot[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetchKitAndReservations(
    req.query.id as string,
    req.query.today as string
  )
  res.status(200).json(result)
}
