import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchKitAndReservations, Kit} from "../../util/data-client";
import {TypeWithContent} from "../../util/notion-db";

type Data = {
  kit: TypeWithContent<Kit, 'content'>,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetchKitAndReservations(
    req.query.id as string,
  )
  if (!result) {
    res.status(404)
    return
  }
  res.status(200).json({ kit: result })
}
