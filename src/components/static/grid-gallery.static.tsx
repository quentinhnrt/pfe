import ArtworkCard from "@/components/static/artwork-card.static";
import pictures from "@/components/static/data/pictures";
import { cn } from "@/lib/utils";
import { Masonry, useInfiniteLoader } from "masonic";
import { useScroller, useSize } from "mini-virtual-list";
import { nanoid } from "nanoid";
import React from "react";

interface GridGalleryProps {
  columnWidth: number;
  columnGutter: number;
  className?: string;
}

const randomChoice = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];
const getFakeItems = (start = 0, end = 32) => {
  const fakeItems = [];
  for (let i = start; i < end; i++)
    fakeItems.push({ id: i, src: randomChoice(pictures), name: nanoid(10) });
  return fakeItems;
};

const getFakeItemsPromise = (start: number, end: number) =>
  Promise.resolve(getFakeItems(start, end));

export const GridGallery = ({
  columnWidth = 300,
  columnGutter = 4,
  className,
}: GridGalleryProps) => {
  const containerRef = React.useRef(null);

  const [items, setItems] = React.useState(getFakeItems);

  const { width, height } = useSize(containerRef);
  const { scrollTop } = useScroller(containerRef);

  const maybeLoadMore = useInfiniteLoader(
    async (startIndex: number, stopIndex: number) => {
      const nextItems = await getFakeItemsPromise(startIndex, stopIndex);
      setItems((current) => [...current, ...nextItems]);
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 32,
      threshold: 3,
    }
  );

  return (
    <div ref={containerRef} className={cn("w-full h-full p-2", className)}>
      <Masonry
        onRender={maybeLoadMore}
        items={items}
        columnGutter={columnGutter}
        columnWidth={columnWidth}
        overscanBy={1.25}
        scrollToIndex={scrollTop}
        scrollFps={12}
        ssrWidth={width}
        ssrHeight={height}
        render={({ data }) => <ArtworkCard {...data} />}
      />
    </div>
  );
};
