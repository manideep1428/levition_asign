import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/AddressForm";
import FileUploader from "../components/FileUploader";
import { FancyMultiSelect } from "../components/MultiSelcter";
import { useNavigate } from "react-router-dom";

const steps = ["Step 1", "Step 2", "Step 3"];

export default function StepperComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onUploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const navigate  = useNavigate();

  const nextStep = () => {
    if (!onUploadSuccess) {
      alert("Please upload, Before leaving");
      return;
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      if(currentStep === 2) return navigate("/submissions");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="container mx-auto py-10 min-h-screen relative">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {index < currentStep ? <Check className="w-6 h-6" /> : index + 1}
              </div>
              <span className="mt-2 text-sm">{step}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 h-1 bg-secondary w-full -z-10">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        {currentStep === 0 && (
          <div>
            <AddressForm onUploadSuccess={setUploadSuccess} />
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <FileUploader onUploadSuccess={setUploadSuccess} />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <FancyMultiSelect onUploadSuccess={setUploadSuccess} />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
        <Button onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} >
        {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
