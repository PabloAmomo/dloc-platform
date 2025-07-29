export interface WebsockeOnEvents {
  onClose: (data: any) => void;
}
export const emptyWebsocketOnEvents: WebsockeOnEvents = { onClose: () => null };