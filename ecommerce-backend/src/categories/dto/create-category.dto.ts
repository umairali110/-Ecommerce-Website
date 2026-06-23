export class CreateCategoryDto {
  name!: string;
  status?: 'active' | 'inactive';
}