"use client";
import { Trash2 } from "lucide-react";
import React, {useEffect, useState} from "react";
import { Controller, useFormContext } from "react-hook-form";

type ValueType = object | number | string | (object | number | string)[];

interface FormRepeaterProps<T> {
  initialValues: T;
  renderFields: (
    item: T,
    index: number,
    handleChange: (index: number, name: keyof T, value: ValueType) => void
  ) => React.ReactNode;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  name: string;
  addButtonRenderer?: (props: { onAdd: (e: MouseEvent) => void }) => React.ReactNode;
}

export default function Repeater<T>({
  initialValues,
  renderFields,
  onAdd,
  onRemove,
  name,
  addButtonRenderer,
}: FormRepeaterProps<T>) {
  const [items, setItems] = useState<T[]>([initialValues]);
  const { control, setValue } = useFormContext();

  // @ts-expect-error event type is not defined in the function signature
  const handleAdd = (e ) => {
    e.preventDefault();
    setItems((prev) => [...prev, initialValues]);
    onAdd?.();
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    onRemove?.(index);
  };

  const handleChange = (index: number, name: keyof T, value: ValueType) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setItems(updatedItems);
  };

  useEffect(() => {
    setValue(name, items);
  }, [items, setValue, name]);

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <>
          {items.map((item, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border p-4 shadow-sm flex items-start justify-between"
            >
              <div className="flex-1">
                {renderFields(item, index, (i, fieldName, value) =>
                  handleChange(i, fieldName, value)
                )}
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="ml-4 mt-1 text-red-600 hover:text-red-800"
                  aria-label="Supprimer la réponse"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}

          {addButtonRenderer ? (
            addButtonRenderer({ onAdd: handleAdd })
          ) : (
            <button
              type="button"
              onClick={(e) => handleAdd(e)}
              className="mt-2 rounded-md px-4 py-2 text-white bg-black border hover:bg-gray-900 w-full"
            >
              Ajouter une entrée
            </button>
          )}
        </>
      )}
    />
  );
}
