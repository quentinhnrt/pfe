import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import ArtworkForm from "@/features/artwork/components/artwork-form";
import CollectionForm from "@/features/forms/components/collection-form";
import PostForm from "@/features/forms/components/post-form";
import { FileText, FolderPlus, Image, Plus } from "lucide-react";

export default function ActionButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus size={18} />
          <span>Publier</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={"end"}
        className={"flex flex-col justify-end"}
      >
        <DropdownMenuItem className={"justify-end"} asChild>
          <ArtworkForm>
            <Button variant="ghost" className={"cursor-pointer"}>
              <div className="flex items-center justify-end gap-3 w-full">
                <span className="font-medium">Créer une œuvre</span>
                <Image size={20} className="text-black dark:text-white" />
              </div>
            </Button>
          </ArtworkForm>
        </DropdownMenuItem>
        <DropdownMenuItem className={"justify-end"} asChild>
          <PostForm>
            <Button variant="ghost" className={"cursor-pointer"}>
              <div className="flex items-center justify-end gap-3 w-full">
                <span className="font-medium">Créer un post</span>
                <FileText size={20} className="text-black dark:text-white" />
              </div>
            </Button>
          </PostForm>
        </DropdownMenuItem>

        <DropdownMenuItem className={"justify-end"} asChild>
          <CollectionForm>
            <Button variant="ghost" className={"cursor-pointer"}>
              <div className="flex items-center justify-end gap-3 w-full">
                <span className="font-medium">Créer une collection</span>
                <FolderPlus size={20} className="text-black dark:text-white" />
              </div>
            </Button>
          </CollectionForm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
