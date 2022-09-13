import type { NextApiRequest, NextApiResponse } from 'next'
import client from "../../util/client";
import {KitOverview} from "../../types/types";

const query = `
*[_type == "kit" && !(_id in path("drafts.**"))] | order(serial asc) {
  _id,
  name,
  description[0],
  type,
  status,
  cover,
  "availableNow": count(
                    *[_type == "reservation" &&
                      kit._ref == ^._id &&
                      startDate <= now() &&
                      endDate >= now() &&
                      status in ["passed", "in-use", "exception"]]
                  ) == 0
}
`

type Data = {
  data: KitOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: await client.fetch(query) })
}
