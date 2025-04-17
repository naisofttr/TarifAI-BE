import { IsOptional, IsArray, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { IIngredientRequest, IIngredientCategories } from './interfaces/index';

export class IngredientCategoriesDto implements IIngredientCategories {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vegetables?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dairyProducts?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  legumes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pastaProducts?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  animalProducts?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dessertsAndPastries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fishAndSeafood?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oils?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  spices?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fruits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nuts?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cannedPickledSauces?: string[];
}

export class IngredientRequestDto implements IIngredientRequest {
  @ValidateNested()
  @Type(() => IngredientCategoriesDto)
  ingredients!: IngredientCategoriesDto;
}

export class IngredientRequestArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientCategoriesDto)
  ingredients!: IngredientCategoriesDto[];
}

export class IngredientDataDto {
  @ValidateNested()
  @Type(() => IngredientCategoriesDto)
  ingredients!: IngredientCategoriesDto;
}

export class CombinationRequestItemDto {
  @ValidateNested()
  @Type(() => IngredientDataDto)
  ingredientData!: IngredientDataDto;

  @IsString()
  @IsNotEmpty()
  languageCode!: string;
}

export class CombinationArrayRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CombinationRequestItemDto)
  combinations!: CombinationRequestItemDto[];
} 