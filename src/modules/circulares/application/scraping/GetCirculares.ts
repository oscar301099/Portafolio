import type {
  CircularRepository,
} from "@/modules/circulares/domain/circular/CircularRepository";
import {
  compareCircularesDesc,
  type StoredCircular,
} from "@/modules/circulares/domain/circular/Circular";

/** Caso de uso: consultar las circulares ya almacenadas, en el orden del listado oficial. */
export class GetCircularesUseCase {
  constructor(private readonly repository: CircularRepository) {}

  async execute(): Promise<StoredCircular[]> {
    const items = await this.repository.findAll();
    return items.sort(compareCircularesDesc);
  }

  count(): Promise<number> {
    return this.repository.count();
  }
}
