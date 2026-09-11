import type {
  CircularRepository,
} from "@/domain/circular/CircularRepository";
import type { StoredCircular } from "@/domain/circular/Circular";

/** Caso de uso: consultar las circulares ya almacenadas. */
export class GetCircularesUseCase {
  constructor(private readonly repository: CircularRepository) {}

  execute(): StoredCircular[] {
    return this.repository.findAll();
  }

  count(): number {
    return this.repository.count();
  }
}
