interface ProgressBarProps { 
    steps: any[]
}

  
  export default function Example({steps}: ProgressBarProps) {
    return (
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {step.status === 'complete' ? (
                <span
                  
                  className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4  md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                >
                  <span className="text-sm font-medium text-indigo-600 ">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              ) : step.status === 'current' ? (
                <span
                  
                  className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-indigo-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              ) : (
                <span

                  className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                >
                  <span className="text-sm font-medium text-gray-500 0">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
  