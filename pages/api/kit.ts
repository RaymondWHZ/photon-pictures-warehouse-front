import type { NextApiRequest, NextApiResponse } from 'next'
import client from "../../util/client";
import {Kit, ReservationSlot} from "../../types/types";

const query = `
{
  "kit": *[_type == "kit" && !(_id in path("drafts.**")) && _id == $id][0] {
    _id,
    name,
    description,
    images,
    rules,
    type,
    status
  },
  "reservations": *[_type == "reservation" &&
                    !(_id in path("drafts.**")) &&
                    kit._ref == $id &&
                    status in ["passed", "in-use", "exception"]] {
    startDate,
    endDate
  }
}
`

type Data = {
  kit: Kit,
  reservation: ReservationSlot[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await client.fetch(query, { id: req.query.id })
  res.status(200).json(result)
}
