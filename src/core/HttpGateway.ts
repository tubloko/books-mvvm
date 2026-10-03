export interface HttpGateway {
  get<ResponseBody>(path: string, signal?: AbortSignal): Promise<ResponseBody>
  post<ResponseBody>(path: string, body: unknown): Promise<ResponseBody>
}
