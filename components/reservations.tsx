import React from "react";
import {Calendar, Result} from "antd";
import {SmileOutlined} from "@ant-design/icons";
import {ReservationSlot} from "../types/types";
import moment from "moment";

export const reservationsToDates = (reservations: ReservationSlot[]): Set<string> => {
  const dates = new Set<string>()
  for (let r of reservations) {
    for (let d = moment(r.startDate); d.isSameOrBefore(r.endDate); d = d.add(1, 'd')) {
      dates.add(d.format("YYYY-MM-DD"))
    }
  }
  return dates
}

interface ReservationDisplayProps {
  unavailableDates: Set<string>
}

export const ReservationDisplay: React.FC<ReservationDisplayProps> = ({ unavailableDates }) => {
  if (unavailableDates.size == 0) {
    return (
      <Result
        icon={<SmileOutlined />}
        title="暂无不可用时段"
        subTitle="所有时段均可预约"
      />
    )
  }
  return (
    <>
      <span style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>
        不可用时段：
      </span>
      <Calendar
        value={moment()}  // disable changing date
        fullscreen={false}
        disabledDate={date => unavailableDates.has(date.format("YYYY-MM-DD"))}
      />
    </>
  )
}
