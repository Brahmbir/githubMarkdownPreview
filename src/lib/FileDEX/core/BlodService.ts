import { hashBlob } from "../utils";
import { DBService } from "./DBService";

export class BlobService {
  constructor(private db: DBService, private storeTag = "blobs") {}

  async store(content: Blob): Promise<string> {
    const hash = await hashBlob(content);
    await this.db.withStore(this.storeTag, "readwrite", (store) =>
      store.put({ hash, content })
    );
    return hash;
  }

  async retrieve(hash: string): Promise<Blob | undefined> {
    return this.db.get<any>(this.storeTag, hash).then((r) => r?.content);
  }
}
