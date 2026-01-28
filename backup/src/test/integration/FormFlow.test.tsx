import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const FormFlow = () => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({});

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div data-testid="form-flow">
      <div>Step {step} of 3</div>
      {step === 1 && (
        <div>
          <input data-testid="name-input" placeholder="Name" />
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input data-testid="email-input" placeholder="Email" />
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <div>Review your information</div>
          <button onClick={prevStep}>Back</button>
          <button data-testid="submit-btn">Submit</button>
        </div>
      )}
    </div>
  );
};

describe('FormFlow Integration', () => {
  it('should navigate through form steps', async () => {
    render(<FormFlow />);
    
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  it('should allow going back', async () => {
    render(<FormFlow />);
    
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Back'));
    
    await waitFor(() => {
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });
  });
});
