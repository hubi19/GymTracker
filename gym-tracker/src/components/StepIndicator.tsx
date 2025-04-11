"use client";

interface StepIndicatorProps {
  steps: { title: string }[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === index
                ? "bg-sky-400 text-white"
                : currentStep > index
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {currentStep > index ? "✓" : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-12 ${
                currentStep > index ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
