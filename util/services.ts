import useSWR from "swr";
import axios, {AxiosResponse} from "axios";
import {ReservationInfo} from "../types/types";
import moment from "moment";

export const useAllKits = () => {
  const today = moment().format("YYYY-MM-DD");
  const { data, error } = useSWR<AxiosResponse>(`/api/kits?today=${today}`, axios.get)
  return {
    data: data?.data.data,
    error,
    loading: !data && !error
  }
}

export const useKitDetail = (id: string) => {
  const today = moment().format("YYYY-MM-DD");
  const { data, error } = useSWR<AxiosResponse>(`/api/kit?id=${id}&today=${today}`, axios.get)
  return {
    data: data?.data,
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
