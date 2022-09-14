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
    status,
    "availableNow": count(
                      *[_type == "reservation" &&
                        kit._ref == ^._id &&
                        startDate <= $today &&
                        endDate >= $today &&
                        status in ["passed", "in-use", "exception"]]
                    ) == 0
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
  const result = await client.fetch(query, {
    id: req.query.id,
    today: req.query.today,
  })
  res.status(200).json(result)
}
