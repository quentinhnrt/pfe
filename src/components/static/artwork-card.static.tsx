import { motion } from "motion/react";
import Image from "next/image";

interface ArtworkCardProps {
  name: string;
  src: string;
}

export const ArtworkCard = ({ name, src }: ArtworkCardProps) => (
  <motion.div className="relative">
    <Image
      alt=""
      src={src}
      width={172}
      height={172}
      className="w-full h-full block"
    />
    <span className="absolute bottom-0 left-0 right-0 p-2 text-center text-white bg-black/50">
      {name}
    </span>
  </motion.div>
);

export default ArtworkCard;
