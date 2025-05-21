"use client"

import BentoGrid from "@bentogrid/core";
import {useEffect} from "react";

export default function BentoGridContainer({children, gridId}: { children: React.ReactNode, gridId: string }) {
    useEffect(() => {
        new BentoGrid({
            target: "#"+gridId,
            cellGap: 16,
            columns: 8,
            aspectRatio: 1,
            balanceFillers: true,
            minCellWidth: 200,
        });
    }, []);

    return (
        <div id={gridId}>
            {children}
        </div>
    );

}