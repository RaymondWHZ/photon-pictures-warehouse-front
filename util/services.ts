import useSWR from "swr";
import axios, {AxiosResponse} from "axios";
import {ReservationInfo} from "../types/types";

export const useAllKits = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/kits', axios.get)
  return {
    data: data?.data.data,
    error,
    loading: !data && !error
  }
}

export const useKitDetail = (id: string) => {
  const { data, error } = useSWR<AxiosResponse>(`/api/kit?id=${id}`, axios.get)
  return {
    data: data?.data,
    error,
    loading: !data && !error
  }
}

export const createReservation = async (reservation: ReservationInfo, abortController: AbortController) => {
  try {
    await axios.post('/api/reserve', reservation, { signal: abortController.signal })
    return true
  } catch (e) {
    return false
  }
}

export const useSettings = () => {
  const { data, error } = useSWR<AxiosResponse>('/api/settings', axios.get)
  return {
    data: data?.data.data,
    error,
    loading: !data && !error
  }
}
