export interface Docs {
    [systemName: string]: string | null;
}

export interface ComponentParameters {
    name: string;
    type: string;
    required: boolean;
    default: unknown;
}

export interface ComponentSchema {
    [componentName: string]: {
        parameters: ComponentParameters[]
        docstring: string | null;
    };
}

export interface SystemComponentMapping {
    system_requirements: {
        [systemName: string]: string[];
    };
    component_schemas: ComponentSchema;
    system_docs: Docs
    component_docs: Docs
}