export interface ContactUsPayload {
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
}

export interface SubscribePayload {
  name: string;
  email: string;
}
