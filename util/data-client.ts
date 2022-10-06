import sanityClient from '@sanity/client'
import {Kit, KitOverview, ReservationInfo, ReservationSlot} from "../types/types";
import {PortableTextBlock} from "@portabletext/types";

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-10-21',
  token: process.env.SANITY_TOKEN,
  useCdn: true
})

export async function fetchManual(): Promise<PortableTextBlock[]> {
  const query = '*[_id == "settings"][0] { manual }'
  return (await client.fetch(query)).manual
}

export async function fetchDev(): Promise<PortableTextBlock[]> {
  const query = '*[_id == "settings"][0] { dev }'
  return (await client.fetch(query)).dev
}

export async function fetchKits(today: string): Promise<KitOverview[]> {
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
                          startDate <= $today &&
                          endDate >= $today &&
                          status in ["passed", "in-use", "exception"]]
                      ) == 0
    }
  `
  return await client.fetch(query, { today })
}

export async function fetchKitAndReservations(id: string, today: string): Promise<{ kit: Kit, reservations: ReservationSlot[] }> {
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
  return (await client.fetch(query, { id, today }))
}

export async function createReservation(reservation: ReservationInfo): Promise<string> {
  const doc = {
    _type: "reservation",
    kit: {
      _type: "reference",
      _ref: reservation.kitId
    },
    name: reservation.name,
    email: reservation.email,
    wechat: reservation.wechat,
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    project: reservation.project,
    usage: reservation.usage,
    status: 'pending'
  }

  const createdDoc = await client.create(doc)
  return createdDoc._id
}
