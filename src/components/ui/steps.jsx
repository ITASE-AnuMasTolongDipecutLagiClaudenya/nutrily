import { Steps } from "@ark-ui/react/steps"

export default function BasicSteps({ currentStep, onStepChange, steps }) {
  return (
    <div className="flex w-full items-center justify-center px-1 py-2">
      <Steps.Root
        className="w-full max-w-2xl"
        count={steps.length}
        onStepChange={({ step }) => onStepChange(step)}
        step={currentStep}
      >
        <Steps.List className="flex items-center justify-between">
          {steps.map((name, index) => (
            <Steps.Item
              className="relative flex not-last:flex-1 items-center"
              index={index}
              key={name}
            >
              <Steps.Trigger
                aria-label={name}
                className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed"
                disabled={index > currentStep}
              >
                <Steps.Indicator className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold data-complete:border-sky-600 data-complete:bg-sky-600 data-complete:text-white data-current:border-sky-600 data-current:bg-sky-600 data-current:text-white data-incomplete:border-slate-200 data-incomplete:bg-slate-100 data-incomplete:text-slate-500">
                  {index === currentStep && (
                    <>
                      <span
                        aria-hidden="true"
                        className="onboarding-step-pulse absolute inset-0 rounded-full bg-sky-300/60"
                      />
                      <span
                        aria-hidden="true"
                        className="onboarding-step-pulse onboarding-step-pulse-delayed absolute inset-0 rounded-full bg-sky-300/45"
                      />
                    </>
                  )}
                  <span className="relative z-10">{index + 1}</span>
                </Steps.Indicator>
              </Steps.Trigger>
              <Steps.Separator
                className="mx-1 h-0.5 flex-1 bg-slate-200 data-complete:bg-sky-600 sm:mx-3"
                hidden={index === steps.length - 1}
              />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
    </div>
  )
}
