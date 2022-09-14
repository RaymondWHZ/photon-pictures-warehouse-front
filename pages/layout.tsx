import React from "react";
import Link from "next/link";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const NavBar: React.FC = () => {
  const { md } = useBreakpoint();
  return (
    <div style={{ position: "fixed", top: 0, width: "100%", height: "65px", background: "black", color: "white", zIndex: 1000,
                  display: "flex", alignItems: "center", paddingLeft: "30px", paddingRight: "40px"}}>
      <div style={{ width: "120px" }}>
        <img src={"/logo.png"} height={ md ? "50px" : "40px" } alt=""/>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Link href={"/"}>
          <a style={{ fontFamily: "Ma Shan Zheng", fontSize: md ? "28px" : "24px", color: "white" }}>器材库</a>
        </Link>
      </div>
      <div style={{ width: "120px", textAlign: "right" }}>
        <Link href={"/"}>
          <a style={{ fontWeight: "bold", color: "white" }}>器材库使用须知</a>
        </Link>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div style={{ width: "100%", padding: "30px", textAlign: "center", color: "gray" }}>
      Copyright © 2022 光子映画 保留所有权利 <Link href={"/dev"}>了解开发信息</Link>
    </div>
  )
}

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <NavBar/>
      <div style={{ paddingTop: "65px" }}>
        {children}
      </div>
      <Footer/>
    </>
  )
}

export default Layout
