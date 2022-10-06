import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchDev} from "../../util/data-client";
import {PortableTextBlock} from "@portabletext/types";

type Data = {
  data: PortableTextBlock[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: await fetchDev() })
}
