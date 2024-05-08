import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchKits, KitOverview} from "../../util/data-client";

type Data = {
  kits: KitOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetchKits()
  res.status(200).json({ kits: result })
}
