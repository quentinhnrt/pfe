'use client'

import { useEffect, ReactNode } from 'react'
import {useLenis} from "lenis/react";

export default function LenisWrapper({ children }: { children: ReactNode }) {
    useLenis((lenis) => {

    })

    return <>{children}</>
}
