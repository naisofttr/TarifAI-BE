import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientDto {
  @IsString()
  name!: string;

  @IsString()
  amount!: string;

  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;
}

export class NutritionalValuesDto {
  @IsNumber()
  @IsOptional()
  calories?: number;

  @IsNumber()
  @IsOptional()
  protein?: number;

  @IsNumber()
  @IsOptional()
  carbs?: number;

  @IsNumber()
  @IsOptional()
  fat?: number;

  @IsNumber()
  @IsOptional()
  fiber?: number;
}

export class RecipeDetailDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsNumber()
  @IsOptional()
  preparationTime?: number;

  @IsNumber()
  @IsOptional()
  cookingTime?: number;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsNumber()
  @IsOptional()
  servings?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @IsArray()
  @IsString({ each: true })
  instructions!: string[];

  @ValidateNested()
  @Type(() => NutritionalValuesDto)
  @IsOptional()
  nutritionalValues?: NutritionalValuesDto;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  reviewCount?: number;

  @IsString()
  @IsOptional()
  combinationId?: string;

  @IsString()
  @IsOptional()
  languageCode?: string;

  @IsString()
  @IsOptional()
  createdAt?: string;
}

export class RecipeDetailResponseDto {
  success!: boolean;
  data?: RecipeDetailDto;
  errorMessage!: string | null;
} 