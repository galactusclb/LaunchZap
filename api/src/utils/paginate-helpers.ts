import { z } from "zod";
import { PaginationOptions } from "../interfaces/paginate.type.ts";
import { BadRequestError } from "./errors/http-error.ts";
import { ModelName, OrderProductMapScalarFieldEnum, OrderScalarFieldEnum, ProductScalarFieldEnum } from "@/lib/prisma/generated/internal/prismaNamespace.ts";
 
type FieldType = 'string' | 'enum' | 'number' | 'date' | 'boolean' | 'relation';

// Update this when your schema changes
const MODEL_FIELD_TYPES: Record<string, Record<string, FieldType>> = {
    [ModelName.Order]: {
        id: 'number',
        orderDescription: 'string',
        idempotencyKey: 'string',
        createdAt: 'date',
    },
    [ModelName.Product]: {
        id: 'number',
        productName: 'string',
        productDescription: 'string',
        createdAt: 'date',
    },
    [ModelName.OrderProductMap]: {
        id: 'string',
        orderId: 'number',
        productId: 'number',
    },
};

// Add entries here when you add enums to your schema
// e.g. SomeStatus: ['ACTIVE', 'INACTIVE']
const ENUM_VALUES: Record<string, string[]> = {};

const MODEL_FIELDS: Record<string, Record<string, string>> = {
    [ModelName.Order]: OrderScalarFieldEnum,
    [ModelName.Product]: ProductScalarFieldEnum,
    [ModelName.OrderProductMap]: OrderProductMapScalarFieldEnum,
};

const DEFAULT_OPERATORS: Record<FieldType, string[]> = {
    string: ['equals', 'contains', 'startsWith', 'endsWith', 'in', 'notIn', 'not'],
    enum: ['equals', 'in', 'notIn', 'not'],
    number: ['equals', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'not'],
    date: ['equals', 'gt', 'gte', 'lt', 'lte'],
    boolean: ['equals'],
    relation: ['some', 'every', 'none', 'is'],
};

export function parseQueryParams<T>(
    query: Record<string, any>,
    allowedFilters: string[],
    modelName: string
): { pagination: PaginationOptions<T>; filters: any } {

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 20);
    const sortBy = allowedFilters.includes(query.sortBy) ? query.sortBy : undefined;
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const modelFields = MODEL_FIELDS[modelName];
    if (!modelFields) throw new BadRequestError(`Model '${modelName}' not found`);

    const modelFieldTypes = MODEL_FIELD_TYPES[modelName] ?? {};
    const filters: any = {};

    for (const key in query) {
        if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) continue;

        const match = key.match(/^(\w+)\[(\w+)\](?:__(\w+))?$/);
        const [field, operator, caseSensitiveMode] = match
            ? [match[1], match[2] || 'equals', match[3] || 'insensitive']
            : [key, 'equals', 'insensitive'];

        if (!allowedFilters.includes(field)) {
            throw new BadRequestError(`Filtering by '${field}' is not allowed. Allowed filters: ${allowedFilters.join(', ')}`);
        }

        if (!Object.values(modelFields).includes(field)) {
            throw new BadRequestError(`Field '${field}' not found in model '${modelName}'`);
        }

        const type: FieldType = modelFieldTypes[field] ?? 'string';
        const validOperators = DEFAULT_OPERATORS[type];

        if (!validOperators.includes(operator)) {
            throw new BadRequestError(`Invalid operator '${operator}' for field '${field}'. Valid operators: ${validOperators.join(', ')}`);
        }

        const value = query[key];
        const isCaseSensitive = isCaseSensitivity(caseSensitiveMode);

        if (type === 'enum') {
            filters[field] = handleEnumParams(field, value, operator);
        } else if (type === 'number') {
            filters[field] = handleNumberParams(value, operator);
        } else if (type === 'date') {
            filters[field] = handleDateParams(field, operator, value);
        } else if (type === 'string') {
            filters[field] = handleStringParams(value, operator, isCaseSensitive);
        } else if (type === 'boolean') {
            filters[field] = handleBooleanParams(field, value);
        }

        if (!filters[field] && type !== 'boolean') filters[field] = {};
    }

    return {
        pagination: { page, limit, sortBy, sortOrder },
        filters,
    };
}

function isCaseSensitivity(caseSensitiveMode: string): boolean {
    return caseSensitiveMode === "exact";
}

function handleDateParams(field: string, operator: string, value: any) {
    const schema = z.string().refine(val => !isNaN(new Date(val).getTime()));
    let parsedDate;
    try {
        parsedDate = schema.parse(value);
    } catch {
        throw new BadRequestError(`Invalid date value '${value}' for field '${field}'. Valid format: YYYY-MM-DD or ISO 8601.`);
    }
    return { [operator]: parsedDate };
}

function handleBooleanParams(field: string, value: any): boolean {
    if (typeof value !== 'string' || (value !== 'true' && value !== 'false')) {
        throw new BadRequestError(`Invalid boolean value ${value} for field '${field}'. Valid values: true, false`);
    }
    return value === 'true';
}

// field is the schema field name whose type is an enum (used to look up ENUM_VALUES key)
function handleEnumParams(field: string, value: any, operator: string): Record<string, any> {
    const enumValues = ENUM_VALUES[field];
    if (!enumValues) throw new BadRequestError(`Enum definition for field '${field}' not found`);

    if (['in', 'notIn'].includes(operator)) {
        const values: string[] = Array.isArray(value)
            ? value
            : String(value).split(',').map(v => v.trim());
        const invalid = values.filter(v => !enumValues.includes(v));
        if (invalid.length > 0) {
            throw new BadRequestError(`Invalid enum values [${invalid.join(', ')}] for field '${field}'. Valid values: ${enumValues.join(', ')}`);
        }
        return { [operator]: values };
    }

    if (!enumValues.includes(String(value))) {
        throw new BadRequestError(`Invalid enum value '${value}' for field '${field}'. Valid values: ${enumValues.join(', ')}`);
    }
    return { [operator]: value };
}

function handleNumberParams(value: any, operator: string): Record<string, any> {
    if (['in', 'notIn'].includes(operator)) {
        return { [operator]: value.split(',').map((v: string) => Number(v)) };
    }
    return { [operator]: Number(value) };
}

function handleStringParams(value: any, operator: string, isCaseSensitive: boolean): Record<string, any> {
    if (['in', 'notIn'].includes(operator)) {
        return {
            [operator]: value.split(',').map((v: string) => String(v)),
            mode: isCaseSensitive ? 'default' : 'insensitive',
        };
    }
    return {
        [operator]: value,
        mode: isCaseSensitive ? 'default' : 'insensitive',
    };
}