import { Prisma } from "@prisma/client";
import { DMMF } from '@prisma/client/runtime/library';

import { z } from "zod";

import { PaginationOptions } from "../interfaces/paginate.type.ts";

import { BadRequestError } from "./errors/http-error.ts";

type FieldType = 'string' | 'enum' | 'number' | 'date' | 'boolean' | 'relation';

const DEFAULT_OPERATORS: Record<FieldType, string[]> = {
    string: ['equals', 'contains', 'startsWith', 'endsWith', 'in', 'notIn', 'not'],
    enum: ['equals', 'in', 'notIn', 'not'],
    number: ['equals', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn', 'not'],
    date: ['equals', 'gt', 'gte', 'lt', 'lte'],
    boolean: ['equals'],
    relation: ['some', 'every', 'none', 'is'] // Support for nested relations
};

function getFieldType(field: DMMF.Field): FieldType {
    if (field.kind === 'enum') return 'enum';
    if (field.kind === 'object') return 'relation'; // Handle relations
    if (field.type === 'String') return 'string';
    if (field.type === 'Boolean') return 'boolean';
    if (field.type === 'Int' || field.type === 'Float' || field.type === 'Decimal') return 'number';
    if (field.type === 'DateTime') return 'date';
    return 'string';
}

export function parseQueryParams<T>(
    query: Record<string, any>,
    allowedFilters: string[],
    modelName: string
): { pagination: PaginationOptions<T>; filters: any } {

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 20);
    const sortBy = allowedFilters.includes(query.sortBy) ? query.sortBy : undefined;
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const filters: any = {};

    for (const key in query) {
        if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) continue;


        const match = key.match(/^(\w+)\[(\w+)\](?:__(\w+))?$/);

        let [field, operator, caseSensitiveMode] = match ? [match[1], match[2] || 'equals', match[3] || 'insensitive'] : [key, 'equals', 'insensitive'];

        if (!allowedFilters.includes(field)) {
            throw new BadRequestError(`Filtering by '${field}' is not allowed. Allowed filters: ${allowedFilters.join(', ')}`);
        }

        const modelMeta = Prisma.dmmf.datamodel.models.find(m => m.name === modelName);
        if (!modelMeta) throw new BadRequestError(`Model '${modelName}' not found`);

        const fieldMeta = modelMeta.fields.find(f => f.name === field);
        if (!fieldMeta) throw new BadRequestError(`Field '${field}' not found in model '${modelName}'`);


        const type = getFieldType(fieldMeta);
        const validOperators = DEFAULT_OPERATORS[type];

        if (!validOperators.includes(operator)) {
            throw new BadRequestError(`Invalid operator '${operator}' for field '${field}'. Valid operators: ${validOperators.join(', ')}`);
        }


        let value = query[key];
        const isCaseSensitive: boolean = isCaseSensitivity(caseSensitiveMode)


        // Handle enum validation
        if (type === 'enum') {
            filters[field] = handleEnumParams(fieldMeta, field, value, operator);
        }
        // Handle number conversion
        else if (type === 'number') {
            filters[field] = handleNumberParams(value, operator)
        }
        // Handle date conversion
        else if (type === 'date') {
            filters[field] = handleDateParams(field, operator, value)
        }

        else if (type === 'string') {
            filters[field] = handleStringParams(value, operator, isCaseSensitive)
        }
        // Handle relations (nested filtering)
        // else if (type === 'relation') {
        //     const relationModel = modelMeta.fields.find(f => f.name === field)?.type;
        //     if (!relationModel) throw new Error(`Relation model for '${field}' not found`);

        //     const [nestedField, nestedOperator] = Object.entries(value)[0];
        //     value = {
        //         [nestedOperator]: parseQueryParams(
        //             { [nestedField]: value[nestedField] },
        //             [nestedField],
        //             relationModel
        //         ).filters
        //     };
        // }
        else if (type === 'boolean') {
            filters[field] = handleBooleanParams(field, value);
        }

        // Build filter condition
        if (!filters[field] && type !== 'boolean') filters[field] = {};

    }

    return {
        pagination: { page, limit, sortBy, sortOrder },
        filters
    };
}

function isCaseSensitivity(caseSensitiveMode: string): boolean {

    return caseSensitiveMode === "exact"
}

function handleDateParams(field: string, operator: string, value: any) {
    const schema = z
        .string()
        .refine(val => !isNaN(new Date(val).getTime()),
            // {
            //     message: `Invalid date value '${value}' for field '${field}'. Valid format: YYYY-MM-DD or ISO 8601.`,
            // }
        )
    // .transform(val => new Date(val));

    let parsedDate;

    try {
        parsedDate = schema.parse(value);

    } catch (err) {
        throw new BadRequestError(`Invalid date value '${value}' for field '${field}'. Valid format: YYYY-MM-DD or ISO 8601.`,);
    }

    return {
        [operator]: parsedDate
    };
}

function handleBooleanParams(field: string, value: any): boolean {
    if (typeof value !== 'string' || (value !== 'true' && value !== 'false')) {
        throw new BadRequestError(`Invalid boolean value ${value} for field '${field}'. Valid values: true, false'`);
    }

    return value === 'true';
}

function handleEnumParams(fieldMeta: any, field: string, value: any, operator: string): Record<string, any> {
    const enumsMeta = Prisma.dmmf.datamodel.enums;
    const enumDef = enumsMeta.find(e => e.name === fieldMeta.type);
    if (!enumDef) throw new BadRequestError(`Enum definition for '${fieldMeta.type}' not found`);

    const enumValues = enumDef?.values.map(v => v.name) || [];

    let values: string[] = [];
    if (['in', 'notIn'].includes(operator)) {
        values = Array.isArray(value) ? value : String(value).split(',').map(v => v.trim());
        const invalid = values.filter(v => !enumValues.includes(v));
        if (invalid.length > 0) {
            throw new BadRequestError(`Invalid enum values [${invalid.join(', ')}] for field '${field}'. Valid values: ${enumValues.join(', ')}`);
        }

        return { [operator]: values };
    } else {
        if (!enumValues.includes(String(value))) {
            throw new BadRequestError(`Invalid enum value '${value}' for field '${field}'. Valid values: ${enumValues.join(', ')}`);
        }
        return { [operator]: value };
    }
}

function handleNumberParams(value: any, operator: string): Record<string, any> {
    if (['in', 'notIn'].includes(operator)) {
        value = value.split(',').map((v: string) => Number(v));

        return {
            [operator]: value
        }
    }

    return {
        [operator]: Number(value)
    }
}

function handleStringParams(value: any, operator: string, isCaseSensitive: boolean): Record<string, any> {

    if (['in', 'notIn'].includes(operator)) {
        const values = value.split(',').map((v: string) => String(v));
        return {
            [operator]: values,
            mode: !isCaseSensitive ? 'insensitive' : 'default' // default = case-sensitive | insensitive
        };
    }

    return {
        [operator]: value,
        mode: !isCaseSensitive ? 'insensitive' : 'default' // default = case-sensitive | insensitive
    };
}