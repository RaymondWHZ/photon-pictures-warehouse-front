import { useRouter } from 'next/router'
import {
  Breadcrumb, Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input, message, Modal, Result
} from "antd";
import Link from "next/link";
import {createReservation, useKitDetail} from "../../util/services";
import React, {PropsWithChildren, useMemo, useRef, useState} from "react";
import {Kit, ReservationSlot} from "../../types/types";
import {PortableText} from "@portabletext/react";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
import {ReservationDisplay, reservationsToDates} from "../../components/reservations";
import {KitImages} from "../../components/images";
import {KitStatusTag, KitTypeTag} from "../../components/tags";

const DescriptionCard: React.FC<{ kit: Kit }> = ({ kit }) => {
  return (
    <Card
      loading={!kit}
      cover={kit && <KitImages images={kit.images} width="600px" height="400px"/>}
      style={{ width: "600px", marginRight: "30px" }}
    >
      {kit &&
        <Meta
            title={
              <>
                <KitTypeTag type={kit.type} style={{ marginBottom: "10px" }}/>  <KitStatusTag status={kit.status}/> <br/>
                <span style={{ fontSize: "24px", marginRight: "5px" }}>{kit.name}</span>
              </>
            }
            description={
              <div style={{ fontSize: "15px", color: "black" }}>
                <PortableText value={kit.description}/>
              </div>
            }
        />
      }
    </Card>
  )
}

const SubTitle: React.FC<PropsWithChildren> = ({ children }) => (
  <span style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>
    {children}
  </span>
)

const ContactModal: React.FC<{ borrowInfo: any, onClose: () => void }> = ({ borrowInfo, onClose }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const abortController = useRef<AbortController | null>(null)

  const onSubmit = async (data: any) => {
    setSubmitting(true)
    abortController.current = new AbortController()
    const result = await createReservation({
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
          subTitle="请微信联系器材库管理人员"
          extra={[
            <Button key={0} onClick={onCloseCancel}>关闭窗口</Button>
          ]}
        />
        :
        <Form form={form} onFinish={onSubmit} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item name="name" label="借用人姓名" rules={[{ required: true, message: '请输入借用人姓名' }]}>
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item name="email" label="借用人 UIUC 邮箱" rules={[{ required: true, message: '请输入借用人 UIUC 邮箱' }]}>
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

const BorrowCard: React.FC<{ kit: Kit, reservations: ReservationSlot[] }> = ({ kit, reservations }) => {
  const [agreed, setAgreed] = useState(false)
  const [borrowInfo, setBorrowInfo] = useState<any>(null)

  const onSubmitBorrowInfo = (data: any) => {
    setBorrowInfo({
      ...data,
      startDate: data.dates[0].format("YYYY-MM-DD"),
      endDate: data.dates[1].format("YYYY-MM-DD"),
      kitId: kit._id,
      kitName: kit.name
    })
  }

  const unavailableDates = useMemo(
    () => reservations ? reservationsToDates(reservations) : new Set<string>(),
    [reservations]
  )

  return (
    <Card
      loading={!kit}
      style={{ width: "370px" }}
    >
      {kit &&
        <Form style={{ display: "flex", flexDirection: "column" }} onFinish={onSubmitBorrowInfo}>
          <ReservationDisplay unavailableDates={unavailableDates}/>
          <Divider/>
          <SubTitle>
              发起借用申请：
          </SubTitle>
          <Form.Item name="dates" rules={[{ required: true, message: '请输入借用起止日期' }]}>
              <DatePicker.RangePicker style={{ width: "100%" }} placeholder={["起始日期", "结束日期"]} disabledDate={date => unavailableDates.has(date.format("YYYY-MM-DD"))} />
          </Form.Item>
          <Form.Item name="project" rules={[{ required: true, message: '请输入项目名称' }]}>
              <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item name="usage" rules={[{ required: true, message: '请输入使用场景' }]}>
              <TextArea placeholder="使用场景" />
          </Form.Item>
          <SubTitle>
              借用规则：
          </SubTitle>
          <PortableText value={kit.rules}/>
          <Checkbox style={{ marginBottom: "8px" }} checked={agreed} onChange={e => setAgreed(e.target.checked)}>
              我已阅读并同意借用规则和<a href={"/"} target="_blank" rel="noreferrer">器材库使用说明</a>
          </Checkbox>
          <Form.Item style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit" style={{ width: "100%" }} disabled={!agreed}>
                  提交借用申请
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

const KitDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useKitDetail(id as string)
  const { kit, reservations } = data ?? {}

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <div style={{ maxWidth: "1000px", width: "100%" }}>
        <Breadcrumb style={{ paddingBottom: "20px" }}>
          <Breadcrumb.Item>
            <Link href={"/kits"}>
              <a>
                所有器材
              </a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            { kit?.name ?? "器材" }
          </Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ display: "flex" }}>
          <DescriptionCard kit={kit}/>
          <BorrowCard kit={kit} reservations={reservations}/>
        </div>
      </div>
    </div>
  )
}

export default KitDetail
