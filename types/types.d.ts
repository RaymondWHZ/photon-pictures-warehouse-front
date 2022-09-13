import {SanityImageSource} from "@sanity/image-url/lib/types/types";
import {PortableTextBlock} from "@portabletext/types";

export interface KitOverview {
  _id: string,
  name: string,
  description: PortableTextBlock[] | PortableTextBlock,
  type: string,
  status: string,
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

export interface Settings {
  manual: PortableTextBlock[]
}
