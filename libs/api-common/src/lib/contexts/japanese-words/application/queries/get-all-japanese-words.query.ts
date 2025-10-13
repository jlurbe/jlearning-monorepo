export class GetAllJapaneseWordsQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly status?: string,
    public readonly difficulty?: string,
    public readonly type?: string
  ) {}
}
