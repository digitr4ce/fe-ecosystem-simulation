export interface Docs {
    [systemName: string]: string | null;
}

export interface ComponentParameter {
    name: string;
    type: string;
    required: boolean;
    default: unknown;
}

export interface ComponentSchema {
    [componentName: string]: {
        parameters: ComponentParameter[]
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