import React, {PropsWithChildren, useMemo, useRef, useState} from "react";
import {Button, Calendar, Card, Checkbox, DatePicker, Divider, Form, Input, message, Modal, Result} from "antd";
import moment from "moment";
import {sendReservation} from "../util/services";
import TextArea from "antd/lib/input/TextArea";
import {Kit, ReservationSlot} from "../util/data-client";

const SubTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <span style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>
    {children}
  </span>
)

const reservationsToDates = (reservations: ReservationSlot[], statuses: string[]): Set<string> => {
  const dates = new Set<string>()
  reservations.forEach((r, i) =>{
    if (['approved', 'out', 'error'].includes(statuses[i])){
      for (let d = moment(r.startDate); d.isSameOrBefore(r.endDate); d = d.add(1, 'd')) {
        dates.add(d.format("YYYY-MM-DD"))
      }
    }
  })
  return dates
}

interface ReservationDisplayProps {
  statusAvailable: boolean
  unavailableDates: Set<string>
}

const ReservationDisplay: React.FC<ReservationDisplayProps> = ({ statusAvailable, unavailableDates }) => {
  return (
    <>
      <SubTitle>
        可预约日期：
      </SubTitle>
      <Calendar
        fullscreen={false}
        disabledDate={date => {
          return (
            !statusAvailable ||
            date.isBefore(moment(), "day") ||
            unavailableDates.has(date.format("YYYY-MM-DD"))
          )
        }}
      />
    </>
  )
}

interface ContactModalProps {
  borrowInfo: any
  onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ borrowInfo, onClose }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const abortController = useRef<AbortController | null>(null)

  const onSubmit = async (data: any) => {
    setSubmitting(true)
    abortController.current = new AbortController()
    const result = await sendReservation({
      ...borrowInfo,
      ...data
    }, abortController.current)
    abortController.current = null
    setSubmitting(false)
    if (result) {
      setSuccess(true)
    } else {
      message.error("提交失败，请重试")
    }
  }

  const onCloseCancel = () => {
    abortController.current?.abort()
    setSubmitting(false)
    setSuccess(false)
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="填写联系信息"
      open={borrowInfo}
      okText="确认提交申请"
      cancelText="取消"
      onOk={() => form.submit()}
      onCancel={onCloseCancel}
      confirmLoading={submitting}
      footer={success ? <></> : undefined}
    >
      {success ?
        <Result
          status="success"
          title="申请提交成功"
          subTitle="你将会收到一封确认邮件，包含下一步申请步骤，请注意查收"
          extra={[
            <Button key={0} onClick={onCloseCancel}>关闭窗口</Button>
          ]}
        />
        :
        <Form form={form} onFinish={onSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item name="name" label="借用人姓名" rules={[{ required: true, message: '请输入借用人姓名' }]}>
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item name="email" label="借用人 UIUC 邮箱" rules={[{ required: true, message: '请输入借用人 UIUC 邮箱', pattern: /.+@illinois.edu/ }]}>
            <Input placeholder="@illinois.edu" />
          </Form.Item>
          <Form.Item name="wechat" label="借用人微信号" rules={[{ required: true, message: '请输入借用人微信号' }]}>
            <Input placeholder="微信号" />
          </Form.Item>
        </Form>
      }
    </Modal>
  )
}

export interface ReservationCardProps extends React.ComponentProps<typeof Card> {
  kit?: Kit
}

export const ReservationCard: React.FC<ReservationCardProps> = (props) => {
  const { kit } = props;
  const [agreed, setAgreed] = useState(false)
  const [borrowInfo, setBorrowInfo] = useState<any>(null)

  const onSubmitBorrowInfo = (data: any) => {
    setBorrowInfo({
      ...data,
      startDate: data.dates[0].format("YYYY-MM-DD"),
      endDate: data.dates[1].format("YYYY-MM-DD"),
      kitId: kit?._id,
      kitName: kit?.name
    })
  }

  const statusAvailable = useMemo(
    () => kit ? kit.status === "active" : false,
    [kit]
  )

  const unavailableDates = useMemo(
    () => kit ? reservationsToDates(kit.record_dates, kit.record_status) : new Set<string>(),
    [kit]
  )

  return (
    <Card
      loading={!kit}
      {...props}
    >
      {kit &&
        <Form
          style={{ display: "flex", flexDirection: "column" }}
          onFinish={onSubmitBorrowInfo}
          disabled={!statusAvailable}
        >
          <ReservationDisplay statusAvailable={statusAvailable} unavailableDates={unavailableDates}/>
          <Divider/>
          <SubTitle>
            发起借用申请：
          </SubTitle>
          <Form.Item name="dates" rules={[{ required: true, message: '请输入借用起止日期' }]}>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              placeholder={["起始日期", "结束日期"]}
              disabledDate={date => {
                return (
                  !statusAvailable ||
                  date.isBefore(moment(), "day") ||
                  unavailableDates.has(date.format("YYYY-MM-DD"))
                )
              }}
            />
          </Form.Item>
          <Form.Item name="project" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item name="usage" rules={[{ required: true, message: '请输入使用场景' }]}>
            <TextArea disabled={!statusAvailable} placeholder="使用场景" />
          </Form.Item>
          <SubTitle>
            借用规则：
          </SubTitle>
            <ul>
              <li>仅限光子映画社员免费借用</li>
              <li>仅可用于完成光子映画所属项目</li>
              <li>一次借用时长为7天，到期可以续借</li>
              <li>丢失 / 损坏最高赔偿：${kit.value}</li>
            </ul>
            <Checkbox style={{marginBottom: "8px"}} checked={agreed} onChange={e => setAgreed(e.target.checked)}>
            我已阅读并同意借用规则和<a href={"/"} target="_blank" rel="noreferrer">器材库使用须知</a>
          </Checkbox>
          <Form.Item style={{ width: "100%" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }} disabled={!agreed}>
              下一步
            </Button>
          </Form.Item>
          <span style={{ width: "100%", textAlign: "center", color: "gray", fontSize: "12px", marginTop: "-15px" }}>
            请在下一步打开的弹窗中填写联系信息
          </span>
          <ContactModal borrowInfo={borrowInfo} onClose={() => setBorrowInfo(null)}/>
        </Form>
      }
    </Card>
  )
}
