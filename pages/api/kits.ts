import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchKits} from "../../util/data-client";
import {KitOverview} from "../../types/types";

type Data = {
  data: KitOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetchKits(req.query.today as string)
  res.status(200).json({ data: result })
}
