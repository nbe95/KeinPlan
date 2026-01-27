import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Obfuscate from "react-obfuscate";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  condition: boolean;
}

export const CondLink = ({ condition, ...props }: PropsWithChildren<LinkProps>) => {
  const { title, ...rest } = props;
  if (condition) {
    return title ? (
      <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>{title}</Tooltip>}>
        <Link {...rest}>{props.children}</Link>
      </OverlayTrigger>
    ) : (
      <Link {...rest}>{props.children}</Link>
    );
  }
  return <>{props.children}</>;
};

interface MailLinkProps {
  email?: string;
  headers?: Record<string, string>;
}

export const CondMailLink = (props: PropsWithChildren<MailLinkProps>) => {
  if (props.email) {
    return (
      <Obfuscate email={props.email} headers={props.headers} obfuscateChildren={false}>
        {props.children}
      </Obfuscate>
    );
  }
  return <>{props.children}</>;
};
