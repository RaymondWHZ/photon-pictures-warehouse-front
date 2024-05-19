import {
  createDBSchemas,
  createNotionDBClient, date, status,
  DBObjectTypesInfer, NotionPageContent, relation, rich_text, title,
  TypeWithContent, number, multi_select, __id, files, formula, email, rollup, DateRange, unique_id
} from "notion-cms-adaptor";

const dbSchemas  = createDBSchemas({
  texts: {
    name: title().plainText(),
  },
  kits__overview: {
    _id: __id(),
    tags: multi_select().stringEnums('audio', 'lighting', 'video'),
    name: title().plainText(),
    description: rich_text().plainText(),
    cover: files().singleNotionImageUrl(),
    status: status().stringEnum('active', 'inactive'),
    current_record_status: formula().string(),
  },
  kits: {
    _id: __id(),
    tags: multi_select().stringEnums('audio', 'lighting', 'video'),
    name: title().plainText(),
    description: rich_text().plainText(),
    cover: files().singleNotionImageUrl(),
    images: files().notionImageUrls(),
    value: number().numberDefaultZero(),
    status: status().stringEnum('active', 'inactive'),
    current_record_status: formula().string(),
    record_dates: rollup().handleArrayUsing((value): DateRange[] => {
      return value.reduce((acc, item) => {
        if (item.type === 'date' && item.date && item.date.end) {
          return acc.concat({
            start: item.date.start,
            end: item.date.end
          })
        }
        return acc
      }, [] as DateRange[])
    }),
    record_status: rollup().handleArrayUsing((value): string[] => {
      return value.reduce((acc, item) => {
        if (item.type === 'status' && item.status) {
          return acc.concat(item.status.name)
        }
        return acc
      }, [] as string[])
    }),
  },
  reservations: {
    id: unique_id().stringWithPrefix(),
    borrower: title().plainText(),
    kit: relation().singleId(),
    status: status().string(),
    dates: date().dateRange(),
    project: rich_text().plainText(),
    usage: rich_text().plainText(),
    wechat: rich_text().plainText(),
    email: email().string()
  }
});

type DBObjectTypes = DBObjectTypesInfer<typeof dbSchemas>
export type KitOverview = DBObjectTypes['kits__overview']
export type Kit = DBObjectTypes['kits']
export type KitStatus = Kit['status']
export type KitTag = Kit['tags'][number]

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
    filter: {
      property: 'status',
      status: {
        does_not_equal: 'hidden'
      }
    }
  })
}

export async function fetchKitAndReservations(id: string): Promise<TypeWithContent<Kit, 'content'>> {
  return await client.queryOneWithContentById('kits', id, 'content');
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
  const result = await client.insertEntry('reservations', {
    borrower: reservation.name,
    kit: reservation.kitId,
    email: reservation.email,
    wechat: reservation.wechat,
    dates: {
      start: reservation.startDate,
      end: reservation.endDate
    },
    project: reservation.project,
    usage: reservation.usage,
    status: 'pending'
  });
  return result.id;
}
