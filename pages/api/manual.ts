import type { NextApiRequest, NextApiResponse } from 'next'
import client from "../../util/client";
import {PortableTextBlock} from "@portabletext/types";

const query = '*[_id == "settings"][0] { manual }'

type Data = {
  data: PortableTextBlock[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: (await client.fetch(query)).manual })
}
