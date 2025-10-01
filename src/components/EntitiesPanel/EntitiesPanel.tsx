import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle } from "lucide-react";
import { useWorldStore } from "@/stores/useWorldStore";
import type { ComponentParameter } from "@/lib/types";

interface ComponentFieldsErrors {
  [componentName: string]: {
    [paramName: string]: string;
  };
}

export function EntitiesPanel() {
  const requirements = useWorldStore((state) => state.requirementsFile);
  const activeSystems = useWorldStore((state) => state.activeSystems);
  const addEntity = useWorldStore((state) => state.addEntity);

  const [entityName, setEntityName] = useState("");
  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(new Set());
  const [componentValues, setComponentValues] = useState<ComponentFieldsErrors>({});
  const [errors, setErrors] = useState<ComponentFieldsErrors>({});

  const requiredComponents = useMemo(() => {
    if (!requirements?.system_requirements) return [];
    
    const componentsSet = new Set<string>();
    selectedSystems.forEach(system => {
      const systemComponents = requirements.system_requirements[system] || [];
      systemComponents.forEach(comp => componentsSet.add(comp));
    });
    
    return Array.from(componentsSet);
  }, [selectedSystems, requirements]);

  const toggleSystem = (system: string) => {
    const newSelected = new Set(selectedSystems);
    if (newSelected.has(system)) {
      newSelected.delete(system);
    } else {
      newSelected.add(system);
    }
    setSelectedSystems(newSelected);
  };

  const parseValue = (value: string, type: string): string | number | boolean | null => {
    if (value === "") return null;
    
    if (type === "float" || type.includes("float")) {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    
    if (type === "int" || type.includes("int")) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    }
    
    if (type === "bool" || type.includes("bool")) {
      return value === "true";
    }
    
    return value;
  };

  const validateField = (
    componentName: string,
    paramName: string,
    value: string | undefined,
    param: ComponentParameter
  ): string | null => {
    if (param.required && !value) {
      return "This field is required";
    }

    if (value) {
      if (param.type.includes("float")) {
        if (isNaN(parseFloat(value))) {
          return "Must be a valid number";
        }
      } else if (param.type.includes("int")) {
        if (isNaN(parseInt(value, 10))) {
          return "Must be a valid integer";
        }
      }
    }

    return null;
  };

  const handleFieldChange = (
    componentName: string,
    paramName: string,
    value: string,
    param: ComponentParameter
  ) => {
    setComponentValues(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        [paramName]: value,
      },
    }));

    const error = validateField(componentName, paramName, value, param);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (!newErrors[componentName]) {
        newErrors[componentName] = {};
      }
      
      if (error) {
        newErrors[componentName][paramName] = error;
      } else {
        delete newErrors[componentName][paramName];
        if (Object.keys(newErrors[componentName]).length === 0) {
          delete newErrors[componentName];
        }
      }
      
      return newErrors;
    });
  };

  const validateAll = (): boolean => {
    const newErrors: ComponentFieldsErrors = {};
    let isValid = true;

    requiredComponents.forEach(componentName => {
      const schema = requirements?.component_schemas?.[componentName];
      if (!schema) return;

      schema.parameters.forEach(param => {
        const value = componentValues[componentName]?.[param.name];
        const error = validateField(componentName, param.name, value, param);
        
        if (error) {
          if (!newErrors[componentName]) {
            newErrors[componentName] = {};
          }
          newErrors[componentName][param.name] = error;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAddEntity = () => {
    if (!entityName.trim()) {
      alert("Please enter an entity name.");
      return;
    }

    if (selectedSystems.size === 0) {
      alert("Please select at least one system.");
      return;
    }

    if (!validateAll()) {
      alert("Please fix validation errors before adding the entity.");
      return;
    }

    const components: Record<string, Record<string, string | number | boolean | null>> = {};
    requiredComponents.forEach(componentName => {
      const schema = requirements?.component_schemas?.[componentName];
      if (!schema) return;

      const componentData: Record<string, string | number | boolean | null> = {};
      schema.parameters.forEach(param => {
        const value = componentValues[componentName]?.[param.name];
        
        if (value !== undefined && value !== null && value !== "") {
          componentData[param.name] = parseValue(value, param.type);
        } else if (param.default !== null && param.default !== undefined) {
          componentData[param.name] = param.default as string | number | boolean;
        }
      });

      components[componentName] = componentData;
    });

    const newEntity = {
      id: crypto.randomUUID(),
      name: entityName,
      components,
      systems: Array.from(selectedSystems),
    };

    addEntity(newEntity);
    
    setEntityName("");
    setSelectedSystems(new Set());
    setComponentValues({});
    setErrors({});
  };

  const renderInput = (componentName: string, param: ComponentParameter) => {
    const value = componentValues[componentName]?.[param.name] ?? "";
    const error = errors[componentName]?.[param.name];

    const inputProps = {
      id: `${componentName}-${param.name}`,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleFieldChange(componentName, param.name, e.target.value, param),
      className: error ? "border-red-500" : "",
    };

    if (param.type.includes("bool")) {
      return (
        <Toggle
          pressed={value === "true"}
          onPressedChange={(pressed) =>
            handleFieldChange(componentName, param.name, String(pressed), param)
          }
        >
          {value === "true" ? "True" : "False"}
        </Toggle>
      );
    }

    if (param.type.includes("float") || param.type.includes("int")) {
      return <Input {...inputProps} type="number" step={param.type.includes("float") ? "0.1" : "1"} />;
    }

    return <Input {...inputProps} type="text" />;
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="entity-name">Entity Name</Label>
        <Input
          id="entity-name"
          placeholder="Enter entity name"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Systems</Label>
        <Collapsible className="border rounded-lg">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>
                {selectedSystems.size > 0
                  ? `${selectedSystems.size} system(s) selected`
                  : "Select systems"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {activeSystems.map((system) => (
                <Toggle
                  key={system}
                  pressed={selectedSystems.has(system)}
                  onPressedChange={() => toggleSystem(system)}
                >
                  {system}
                </Toggle>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {requiredComponents.length > 0 && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Required Components</Label>
          
          {requiredComponents.map((componentName) => {
            const schema = requirements?.component_schemas?.[componentName];
            if (!schema) return null;

            return (
              <Collapsible key={componentName} defaultOpen className="border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="font-medium">{componentName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 space-y-4">
                  {schema.parameters.map((param) => {
                    const error = errors[componentName]?.[param.name];
                    
                    return (
                      <div key={param.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${componentName}-${param.name}`}>
                            {param.name}
                            {param.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            ({param.type})
                          </span>
                        </div>
                        
                        {renderInput(componentName, param)}
                        
                        {error && (
                          <div className="flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                          </div>
                        )}
                        
                        {!param.required && param.default !== null && (
                          <p className="text-xs text-muted-foreground">
                            Default: {String(param.default)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}

      <Button 
        onClick={handleAddEntity}
        disabled={!entityName.trim() || selectedSystems.size === 0}
        className="w-full"
      >
        Add Entity
      </Button>
    </div>
  );
}