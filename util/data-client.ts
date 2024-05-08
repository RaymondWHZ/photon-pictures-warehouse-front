import {
  createDBSchemas,
  createNotionDBClient,
  DBObjectTypesInfer, NotionPageContent,
  TypeWithContent
} from "./notion-db";

export type ReservationSlot = {
  startDate: string,
  endDate: string
}

const dbSchemas  = createDBSchemas({
  texts: {
    name: 'title'
  },
  kits__overview: {
    _id: '__id',
    tags: 'multi_select',
    name: 'title',
    description: 'rich_text',
    cover__img: 'files',
    value: 'number',
    status: 'status',
    current_record_status: 'formula',
  },
  kits: {
    _id: '__id',
    tags: 'multi_select',
    name: 'title',
    description: 'rich_text',
    cover__img: 'files',
    images__img: 'files',
    value: 'number',
    status: 'status',
    current_record_status: 'formula',
    record_dates: {
      type: 'rollup',
      handler: (value): ReservationSlot[] => {
        if (value.rollup.type === 'array') {
          return value.rollup.array.reduce((acc, item) => {
            if (item.type === 'date' && item.date && item.date.end) {
              return acc.concat({
                startDate: item.date.start,
                endDate: item.date.end
              })
            }
            return acc
          }, [] as ReservationSlot[])
        }
        return []
      },
    },
    record_status: {
      type: 'rollup',
      handler: (value): string[] => {
        if (value.rollup.type === 'array') {
          return value.rollup.array.reduce((acc, item) => {
            if (item.type === 'status' && item.status) {
              return acc.concat(item.status.name)
            }
            return acc
          }, [] as string[])
        }
        return []
      }
    },
  },
  reservations: {
    borrower: 'title',
    kit: 'relation',
    status: 'status',
    dates: 'date',
    project: 'rich_text',
    usage: 'rich_text',
    wechat: 'rich_text',
    email: 'rich_text',
  }
});

type DBObjectTypes = DBObjectTypesInfer<typeof dbSchemas>
export type KitOverview = DBObjectTypes['kits__overview']
export type Kit = DBObjectTypes['kits']

const client = createNotionDBClient({
  notionToken: process.env.NOTION_TOKEN!,
  dbPageId: process.env.NOTION_CMS_ENTRY_PAGE_ID!,
  dbSchemas,
});

export async function fetchManual(): Promise<NotionPageContent> {
  return await client.queryText('texts', 'warehouse-rules')
}

export async function fetchDev(): Promise<NotionPageContent> {
  return await client.queryText('texts', 'development-info')
}

export async function fetchKits(): Promise<KitOverview[]> {
  return await client.query('kits__overview', {
    sorts: [{
      property: 'serial',
      direction: 'ascending'
    }],
  })
}

export async function fetchKitAndReservations(id: string): Promise<TypeWithContent<Kit, 'content'>> {
  return client.queryOneWithContentById('kits', id, 'content');
}

export interface ReservationInfo {
  startDate: string,
  endDate: string;
  kitId: string;
  kitName: string;
  name: string;
  email: string;
  wechat: string;
  project: string;
  usage: string;
}

export async function createReservation(reservation: ReservationInfo): Promise<string> {
  return await client.insertToDB('reservations', {
    borrower: [{ text: { content: reservation.name } }],
    kit: [{ id: reservation.kitId }],
    email: reservation.email,
    wechat: [{ text: { content: reservation.wechat } }],
    dates: {
      start: reservation.startDate,
      end: reservation.endDate
    },
    project: [{ text: { content: reservation.project } }],
    usage: [{ text: { content: reservation.usage } }],
    status: { name: 'pending' }
  });
}
