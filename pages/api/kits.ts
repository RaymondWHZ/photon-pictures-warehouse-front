import type { NextApiRequest, NextApiResponse } from 'next'
import client from "../../util/client";
import {KitOverview} from "../../types/types";

const query = '*[_type == "kit" && !(_id in path("drafts.**"))]{ _id, name, description, type, status, cover }'

type Data = {
  data: KitOverview[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: await client.fetch(query) })
}
