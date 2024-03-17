import { cn } from "@/lib/utils";

type AlbumMemoriesStepperProps = {
  activeStep: number;
};

export function AlbumMemoriesStepper({
  activeStep,
}: AlbumMemoriesStepperProps) {
  return (
    <section className="flex gap-4">
      <div className="w-full">
        <h2 className="text-center font-medium">Details</h2>
        <div className={cn("h-2 w-full bg-primary rounded-sm")} />
      </div>

      <div className="w-full">
        <h2 className="text-center font-medium">Memories</h2>
        <div
          className={cn(
            "h-2 w-full bg-gray-300 rounded-sm",
            activeStep === 1 && "bg-primary",
          )}
        />
      </div>
    </section>
  );
}
