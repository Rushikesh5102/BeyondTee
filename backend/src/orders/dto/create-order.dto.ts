import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested, IsOptional, IsObject, IsNumber } from 'class-validator';

class CreateOrderItemDto {
    @IsString()
    productId: string;

    @IsInt()
    quantity: number;

    @IsNumber()
    price: number;

    @IsString()
    @IsOptional()
    size?: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsObject()
    @IsOptional()
    customizationData?: any; // JSON payload for design
}

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsNumber()
    totalAmount: number;

    @IsString()
    shippingAddressId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
