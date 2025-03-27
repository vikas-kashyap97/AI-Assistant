"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { HyperText } from "@/components/magicui/hyper-text";
import { AssistantContext } from "@/context/AssistantContext";
import { ChevronRight } from "lucide-react";
import { useContext } from "react";

function EmptyChatState() {
  const { assistant } = useContext(AssistantContext);

  return (
    <div className="flex flex-col items-center">
      <HyperText className="text-center">How can I assist you?</HyperText>

      <div className="mt-7">
        {(assistant?.sampleQuestions || []).map(
          (suggestion: string, index: number) => (
            <BlurFade delay={0.25 * index} key={suggestion}>
              <div key={index}>
                <h2 className="p-4 text-lg border mt-1 rounded-xl hover:bg-gray-200 cursor-pointer flex items-center justify-between gap-10">
                  {suggestion}
                  <ChevronRight />
                </h2>
              </div>
            </BlurFade>
          )
        )}
      </div>
    </div>
  );
}

export default EmptyChatState;
