import useSWR from "swr";
import axios, {AxiosResponse} from "axios";
import {Kit, KitOverview, ReservationInfo} from "./data-client";
import {TypeWithContent} from "./notion-db";

export const useAllKits = () => {
  const { data, error } = useSWR<AxiosResponse<{ kits: KitOverview[] }>>(`/api/kits`, axios.get)
  return {
    data: data?.data.kits as KitOverview[] | undefined,
    error,
    loading: !data && !error
  }
}

export const useKitDetail = (id: string) => {
  const { data, error } = useSWR<AxiosResponse<{ kit: TypeWithContent<Kit, 'content'> }>>(`/api/kit?id=${id}`, axios.get)
  return {
    data: data?.data.kit,
    error,
    loading: !data && !error
  }
}

export const sendReservation = async (reservation: ReservationInfo, abortController: AbortController) => {
  try {
    await axios.post('/api/reserve', reservation, { signal: abortController.signal })
    return true
  } catch (e) {
    return false
  }
}

export const useManual = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/manual', axios.get)
  return {
    data: data?.data.data,
    error,
    loading: !data && !error
  }
}

export const useDev = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/dev', axios.get)
  return {
    data: data?.data.data,
    error,
    loading: !data && !error
  }
}
