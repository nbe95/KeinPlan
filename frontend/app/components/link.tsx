import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import Obfuscate from "react-obfuscate";

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


interface MailLinkProps {
  email?: string;
  headers?: Record<string, string>;
}

export const CondMailLink = (props: PropsWithChildren<MailLinkProps>) => {
  if (props.email) {
    return <Obfuscate email={props.email} headers={props.headers} obfuscateChildren={false}>
      {props.children}
    </Obfuscate>
  }
  return <>{props.children}</>;
};
