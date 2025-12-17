import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

const AIModule = () => (
  <div data-testid="ai-module">
           
        </div><h1>AI Content Generation</h1>
    <div>Generate content using AI</div>);

describe("AI Module", () => {
  it("should render AI module", () => {
    render(<AIModule />);

    expect(screen.getByTestId("ai-module")).toBeInTheDocument();

    expect(screen.getByText("AI Content Generation")).toBeInTheDocument();

  });

});
