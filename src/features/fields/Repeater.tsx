import React, { useEffect, useState } from "react";
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
}

export default function Repeater<T>({
  initialValues,
  renderFields,
  onAdd,
  onRemove,
  name,
}: FormRepeaterProps<T>) {
  const [items, setItems] = useState<T[]>([initialValues]);
  const { control, setValue } = useFormContext();

  const handleAdd = () => {
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
            <div key={index} className="mb-4 rounded-lg border p-4 shadow-sm">
              <div>
                {renderFields(item, index, (i, name, value) =>
                  handleChange(i, name, value)
                )}
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="mt-2 text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
          >
            Add More
          </button>
        </>
      )}
    />
  );
}
