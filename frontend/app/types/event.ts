export interface Event {
  uid: string;
  title: string;
  start_date: Date;
  end_date: Date;
  role?: string;
  location?: string;
}

export interface EditableEvent {
  event: Event;
  original: Event;
}
