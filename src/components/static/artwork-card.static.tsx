import Image from "next/image";

interface ArtworkCardProps {
  name: string;
  src: string;
}

export const ArtworkCard = ({ name, src }: ArtworkCardProps) => (
  <div className="relative group transition-all duration-300">
    <Image
      alt=""
      src={src}
      width={200}
      height={200}
      className="w-full h-full block rounded-sm"
    />
    <div className="absolute bottom-0 left-0 p-2 text-center opacity-0 group-hover:opacity-100 bg-black/50 w-full text-white">
      <span className="text-sm">{name}</span>
    </div>
  </div>
);

export default ArtworkCard;
