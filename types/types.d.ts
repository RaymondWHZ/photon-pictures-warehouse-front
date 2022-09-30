import {SanityImageSource} from "@sanity/image-url/lib/types/types";
import {PortableTextBlock} from "@portabletext/types";

export type KitTypes = "audio" | "lighting" | "video";

export type KitStatus = "available" | "unavailable";

export interface KitOverview {
  _id: string,
  name: string,
  description: PortableTextBlock[] | PortableTextBlock,
  type: KitTypes,
  status: KitStatus,
  cover: SanityImageSource,
  availableNow: boolean
}

export interface Kit extends KitOverview {
  images: SanityImageSource[],
  rules: PortableTextBlock[]
}

export interface ReservationSlot {
  startDate: string,
  endDate: string;
}

export interface ReservationInfo extends ReservationSlot {
  kitId: string;
  kitName: string;
  name: string;
  email: string;
  wechat: string;
  project: string;
  usage: string;
}
