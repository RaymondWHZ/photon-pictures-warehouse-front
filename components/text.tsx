import React from "react";
import type {NotionPageContent} from "../util/notion-db";
import {Render} from "@9gustin/react-notion-render";

interface NotionPageContentRendererProps {
  value: NotionPageContent
}

export const NotionPageContentRenderer: React.FC<NotionPageContentRendererProps> = ({ value }) => {
  return <Render blocks={value as any}/>;  // Use a third party library to render Notion page content for now
}