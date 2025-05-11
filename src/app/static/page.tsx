"use client";

import { AuroraBackground } from "@/components/static/aurora-background.static";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Static() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative px-4"
      >
        <Button>Test</Button>
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Background lights are cool you know.
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
