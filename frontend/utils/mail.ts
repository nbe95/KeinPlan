export interface MailProps {
  recipient: string;
  subject?: string;
  body?: string;
}

export const createMailToLink = (props: MailProps): string => {
  let url: URL = new URL(`mailto:${props.recipient}`);

  if (props.subject) url.searchParams.append("subject", encodeURIComponent(props.subject));

  if (props.body) url.searchParams.append("body", encodeURIComponent(props.body));

  return url.toString();
};
