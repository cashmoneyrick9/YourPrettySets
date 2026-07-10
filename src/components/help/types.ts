import type { ReactNode } from "react";

export type HelpContentsItem = Readonly<{
  id: string;
  label: string;
}>;

export type HelpLink = Readonly<{
  description?: string;
  title: string;
  to: string;
}>;

export type HelpStepItem = Readonly<{
  body: ReactNode;
  title: string;
}>;

export type HelpFactItem = Readonly<{
  detail?: ReactNode;
  label: string;
  value: ReactNode;
}>;
