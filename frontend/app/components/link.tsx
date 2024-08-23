import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  condition: boolean;
}

export const CondLink = (props: PropsWithChildren<LinkProps>) => {
  if (props.condition) {
    return <Link {...props}>{props.children}</Link>;
  }
  return <>{props.children}</>;
};
