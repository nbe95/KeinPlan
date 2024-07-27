export interface MailProps {
  recipient: string;
  subject?: string;
  body?: string;
}

export const createMailToLink = (props: MailProps): string => {
  const args: string[] = [];
  if (props.subject) args.push(`subject=${encodeURIComponent(props.subject)}`);
  if (props.body) args.push(`body=${encodeURIComponent(props.body)}`);

  return `mailto:${props.recipient}` + (args.length ? "?" : "") + args.join("&");
};
