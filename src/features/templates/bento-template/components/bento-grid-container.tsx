"use client"

export default function BentoGridContainer({children, gridId}: { children: React.ReactNode, gridId: string }) {
    return (
        <div className={"grid grid-cols-8"} id={gridId}>
            {children}
        </div>
    );

}