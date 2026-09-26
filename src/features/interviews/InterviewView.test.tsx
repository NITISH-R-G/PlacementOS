import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InterviewView } from './InterviewView'

describe('InterviewView - Behavioral STAR Evaluator', () => {
  it('renders header and behavioral questions prompt list', () => {
    render(<InterviewView />)

    expect(
      screen.getByText(/Interview Preparation & AI Evaluator/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/High-Frequency Behavioral Prompts/i)
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(/Tell me about a time you had a technical disagreement/i).length
    ).toBeGreaterThanOrEqual(1)
  })

  it('disables submit button when answer is blank', () => {
    render(<InterviewView />)

    const evaluateBtn = screen.getByRole('button', {
      name: /run interview ai evaluator/i,
    })
    expect(evaluateBtn).toBeDisabled()
  })

  it('submits answer and renders STAR evaluation criteria feedback', async () => {
    render(<InterviewView />)

    const textarea = screen.getByLabelText(/your answer draft or transcript/i)
    fireEvent.change(textarea, {
      target: {
        value:
          'In my 3rd semester database project, our team debated PostgreSQL vs MongoDB. I set up a local benchmark to test read/write latency under concurrent connections. The results proved Postgres was 40% faster for our relational schema.',
      },
    })

    const evaluateBtn = screen.getByRole('button', {
      name: /run interview ai evaluator/i,
    })
    expect(evaluateBtn).not.toBeDisabled()

    fireEvent.click(evaluateBtn)

    expect(screen.getByText(/Evaluating STAR.../i)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(
          screen.getByText(/Interviewer Evaluation Feedback/i)
        ).toBeInTheDocument()
        expect(screen.getByText(/Situation & Task/i)).toBeInTheDocument()
        expect(screen.getByText(/Personal Action/i)).toBeInTheDocument()
        expect(screen.getByText(/Quantified Result/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
