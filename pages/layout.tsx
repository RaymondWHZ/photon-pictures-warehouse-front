import React from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <div style={{ position: "fixed", top: 0, width: "100%", height: "70px", background: "black", color: "white", zIndex: 1000,
                  display: "flex", alignItems: "center", paddingLeft: "30px", paddingRight: "30px"}}>
      <div style={{ width: "100px" }}>
        <img src={"/logo.png"} height="50px" alt=""/>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Link href={"/"}>
          <a style={{ fontFamily: "Ma Shan Zheng", fontSize: "28px" }}>器材库</a>
        </Link>
      </div>
      <div style={{ width: "100px" }}>
        <Link href={"/"}>
          <a style={{ fontWeight: "bold" }}>器材库使用须知</a>
        </Link>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <div style={{ width: "100%", padding: "30px", textAlign: "center", color: "gray" }}>
      光子映画 2022 保留所有权利
    </div>
  )
}

export default ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <NavBar/>
      <div style={{ paddingTop: "70px" }}>
        {children}
      </div>
      <Footer/>
    </>
  )
}
