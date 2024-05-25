export interface MailProps {
  recipient: string;
  subject?: string;
  body?: string;
}

export const createMailToLink = (props: MailProps): string => {
  return (
    `mailto:${props.recipient}` +
    `?subject=${encodeURIComponent(props.subject ?? "")}` +
    `&body=${encodeURIComponent(props.body ?? "")}`
  );
};
