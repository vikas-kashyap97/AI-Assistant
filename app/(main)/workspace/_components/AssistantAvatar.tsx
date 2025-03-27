import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import AIAssistantsList from "@/services/AIAssistantsList";

function AssistantAvatar({ children, selectedImage }: any) {
    return (
      <Popover>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          <div className="grid grid-cols-5 gap-2">
            {AIAssistantsList.map((assistant) => (
              assistant.image && (
                <Image
                  key={assistant.name} 
                  src={assistant.image}
                  alt={assistant.name}
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-lg object-cover cursor-pointer"
                  onClick={() => selectedImage(assistant.image)}
                />
              )
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

export default AssistantAvatar;
