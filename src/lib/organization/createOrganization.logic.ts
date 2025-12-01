/**
 * Organization creation logic
 * Contains validation and business rules for creating organizations
 */

export interface CreateOrganizationInput {
  name: string;
  orgId: string;
  type: string;
  vision?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates organization creation input
 * @param input - The organization creation input
 * @returns ValidationResult with valid flag and errors
 */
export function validateOrganizationInput(input: CreateOrganizationInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate name (required)
  if (!input.name || input.name.trim() === '') {
    errors.name = '組織名は必須です';
  }

  // Validate orgId (required)
  if (!input.orgId || input.orgId.trim() === '') {
    errors.orgId = '組織IDは必須です';
  }

  // Validate type (required)
  if (!input.type || input.type.trim() === '') {
    errors.type = '組織の種類は必須です';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
