export abstract class Entity<Entity, PrimitiveData> {
  abstract toPrimitives(): PrimitiveData;
}
