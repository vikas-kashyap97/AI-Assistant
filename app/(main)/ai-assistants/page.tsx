"use client";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AIAssistantsList from "@/services/AIAssistantsList";
import { Checkbox } from "@/components/ui/checkbox";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";


export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?:string
};

const AIAssistant = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<ASSISTANT[]>([]);
  const insertAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistants);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const router = useRouter();


  useEffect(()=>{
    user&&GetUserAssistants();
  },[user])


  const GetUserAssistants= async ()=>{
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants,{
      uid:user._id
    });
    console.log(result);
    if (result.length > 0) 
    {
    //Navigate to New Screen
    router.replace('/workspace')
      return ;
    }
    
    
  }

  const onSelect = (assistant: ASSISTANT) => {
    const isAlreadySelected = selectedAssistant.some((item) => item.id === assistant.id);
    if (isAlreadySelected) {
      setSelectedAssistant(selectedAssistant.filter((item) => item.id !== assistant.id));
    } else {
      setSelectedAssistant((prev) => [...prev, assistant]);
    }
  };

  const IsAssistantSelected = (assistant: ASSISTANT) => {
    return selectedAssistant.some((item) => item.id === assistant.id);
  };

  const OnClickContinue = async () => {
    setLoading(true);
    const result = await insertAssistant({
      records: selectedAssistant,
      uid:user?._id
    });
    setLoading(false);
    console.log(result);
    
    }

  return (
    <div className="px-6 md:px-20 lg:px-32 xl:px-40 mt-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center md:text-left">
          <BlurFade delay={0.25} inView>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to the AI Assistant Hub</h2>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
              Choose your AI Companion to Simplify your Task
            </p>
          </BlurFade>
        </div>

        {/* Continue Button */}
        <Button
          disabled={selectedAssistant?.length == 0 || loading}
          onClick={OnClickContinue}
          className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          {loading && <Loader2Icon className="animate-spin" />} Continue
        </Button>
      </div>

      {/* Assistants List Section */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {AIAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.image} delay={0.25 + index * 0.05} inView>
            <div
              key={index}
              onClick={() => onSelect(assistant)}
              className="cursor-pointer dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Image Container with Checkbox Inside */}
              <div className="relative w-[200px] h-[200px]">
                {/* Checkbox inside the image with higher z-index */}
                <Checkbox
                  className="absolute top-2 left-2 w-6 h-6 bg-white border-2 border-gray-500 rounded-md 
                             checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-400 
                             z-10"
                  checked={IsAssistantSelected(assistant)}
                  onCheckedChange={() => onSelect(assistant)}
                />

                {/* Assistant Image */}
                <Image
                  src={assistant.image}
                  alt={assistant.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl z-0"
                />
              </div>

              {/* Assistant Name & Title */}
              <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">{assistant.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{assistant.title}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default AIAssistant;
