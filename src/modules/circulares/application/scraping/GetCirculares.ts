import type {
  CircularRepository,
} from "@/modules/circulares/domain/circular/CircularRepository";
import type { StoredCircular } from "@/modules/circulares/domain/circular/Circular";

/** Caso de uso: consultar las circulares ya almacenadas. */
export class GetCircularesUseCase {
  constructor(private readonly repository: CircularRepository) {}

  execute(): Promise<StoredCircular[]> {
    return this.repository.findAll();
  }

  count(): Promise<number> {
    return this.repository.count();
  }
}
