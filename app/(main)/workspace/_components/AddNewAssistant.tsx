"use client";
import React, { useContext, useState } from "react";
import { AssistantContext } from "@/context/AssistantContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AIAssistantsList from "@/services/AIAssistantsList";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ASSISTANT } from "../../ai-assistants/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import AssistantAvatar from "./AssistantAvatar";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { Loader2Icon } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const DEFAULT_ASSISTANT = {
  image: "/bug-fixer.avif",
  name: "",
  title: "",
  instruction: "",
  id: 0,
  sampleQuestions: [],
  userInstruction: "",
  aiModelId: "",
};
function AddNewAssistant({ children }: any) {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const [selectedAssistant, setSelectedAssistant] =
    useState<ASSISTANT>(DEFAULT_ASSISTANT);
  const AddAssistant = useMutation(
    api.userAiAssistants.InsertSelectedAssistants
  );
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field: string, value: string) => {
    setSelectedAssistant((prev: any) => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    if (
      !selectedAssistant?.name ||
      !selectedAssistant.title ||
      !selectedAssistant.userInstruction
    ) {
      toast("Please enter all details");
      return;
    }
    setLoading(true);
    const result = await AddAssistant({
      records: [selectedAssistant],
      uid: user?._id,
    });
    toast("New Assistant Added!");
    setAssistant(null);
    setLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Assistant</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-3 gap-5 mt-5">
              <div className="mt-5 border-r p-3">
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                  className="w-full"
                >
                  + Create New Assistant
                </Button>
                <div className="mt-2">
                  {AIAssistantsList.map((assistant) => (
                    <div
                      key={assistant.name}
                      onClick={() => {
                        setSelectedAssistant(assistant);
                      }}
                      className="p-2 hover:bg-secondary flex gap-2 items-center rounded-xl cursor-pointer"
                    >
                      {assistant.image ? (
                        <Image
                          src={assistant.image}
                          width={35}
                          height={35}
                          alt={assistant.name}
                          className="w-[35px] h-[35px] object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-[35px] h-[35px] bg-gray-200 rounded-lg" />
                      )}
                      <h2 className="text-xs">{assistant.title}</h2>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex gap-5">
                  {selectedAssistant && (
                    <AssistantAvatar
                      selectedImage={(image: string) =>
                        onHandleInputChange("image", image)
                      }
                    >
                      <Image
                        src={selectedAssistant?.image}
                        alt="assistant"
                        width={100}
                        height={100}
                        className="h-[100px] w-[100px] rounded-xl cursor-pointer object-cover"
                      />
                    </AssistantAvatar>
                  )}
                  <div className="flex flex-col gap-3 mt-4 w-full">
                    <Input
                      placeholder="Name of the Assistant"
                      className="w-full"
                      value={selectedAssistant?.name}
                      onChange={(event) =>
                        onHandleInputChange("name", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Title of the Assistant"
                      className="w-full"
                      value={selectedAssistant?.title}
                      onChange={(event) =>
                        onHandleInputChange("title", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="m-1 text-gray-700">Model: </h2>
                  <Select
                    defaultValue={selectedAssistant?.aiModelId}
                    onValueChange={(value) =>
                      onHandleInputChange("aiModelId", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white ">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AiModelOptions.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          <div className="flex gap-2 items-center m-1">
                            <Image
                              src={model.logo}
                              alt={model.name}
                              width={20}
                              height={20}
                              className="rounded-md"
                            />
                            <h2>{model.name}</h2>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4">
                  <h2 className="m-1 text-gray-700">Instruction:</h2>
                  <textarea
                    placeholder="Add Instructions"
                    value={selectedAssistant.userInstruction}
                    className="h-[200px] w-full"
                    onChange={(event) =>
                      onHandleInputChange("userInstruction", event.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 justify-end mt-10">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button disabled={loading} onClick={onSave}>
                    {loading && <Loader2Icon className="animate-spin" />} Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewAssistant;
