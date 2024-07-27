import Link from "next/link";
import { PropsWithChildren } from "react";

type LinkProps = {
  condition: boolean;
  href: string;
};

export const CondLink = (props: PropsWithChildren<LinkProps>) => {
  if (props.condition) {
    return <Link {...props}>{props.children}</Link>;
  }
  return <>{props.children}</>;
};
