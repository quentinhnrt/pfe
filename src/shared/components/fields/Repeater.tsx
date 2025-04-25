import React, {useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";

interface FormRepeaterProps<T> {
    initialValues: T;
    renderFields: (item: T, index: number, handleChange: (index: number, name: keyof T, value: any) => void) => React.ReactNode;
    onAdd?: () => void;
    onRemove?: (index: number) => void;
    name: string;
}

export default function Repeater<T>({
                                            initialValues,
                                            renderFields,
                                            onAdd,
                                            onRemove,
                                            name
                                        }: FormRepeaterProps<T>) {
    const [items, setItems] = useState<T[]>([initialValues]);
    const { control, setValue } = useFormContext()

    const handleAdd = () => {
        setItems((prev) => [...prev, initialValues]);
        onAdd?.();
    };

    const handleRemove = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
        onRemove?.(index);
    };

    const handleChange = (index: number, name: keyof T, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [name]: value };
        setItems(updatedItems);
    };

    useEffect(() => {
        setValue(name, items);
    }, [items]);

    return (
        <Controller name={name} control={control} render={() => (
            <>
                {items.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                        <div>{renderFields(item, index, (i, name, value) => handleChange(i, name, value))}</div>
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-red-600 text-sm mt-2"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-4 py-2 mt-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                >
                    Add More
                </button>
            </>
        )} />
    );
}