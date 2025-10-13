export class UpdateJapaneseWordCommand {
  constructor(
    public readonly id: string,
    public readonly word?: string,
    public readonly reading?: string,
    public readonly translation?: string,
    public readonly pronunciation?: string,
    public readonly exampleSentence?: string,
    public readonly type?: string,
    public readonly notes?: string,
    public readonly status?: string,
    public readonly difficulty?: string,
    public readonly reviewedAt?: Date
  ) {}
}
