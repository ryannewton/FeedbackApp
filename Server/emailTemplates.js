export function officialReply({ feedback, message }) {
  const subjectLine = 'Suggestion Box: New Management Response';
  const bodyText = `Management just responded to your feedback:\n
${feedback.text}\n
\n
Management has said:\n
${message}\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}

export function rejectedFeedback({ feedback, message }) {
  const subjectLine = 'Suggestion Box: Feedback rejected';
  const bodyText = `In response to your feedback:\n
${feedback.text}\n
\n
Your feedback was rejected because:\n
${message}\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}

export function rejectedSolution({ solution, message }) {
  const subjectLine = 'Suggestion Box: Solution rejected';
  const bodyText = `In response to your Solution:\n
${solution.text}\n
\n
Your solution was rejected because:\n
${message}\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}

export function clarifyFeedback({ feedback, message }) {
  const subjectLine = 'Suggestion Box: Clarification needed';
  const bodyText = `In response to your feedback:\n
${feedback.text}\n
\n
Some clarification is needed:\n
${message}\n
\n
You can reply to this email and your message will be passed along.\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}

export function clarifySolution({ solution, message }) {
  const subjectLine = 'Suggestion Box: Clarification needed';
  const bodyText = `In response to your solution:\n
${solution.text}\n
\n
Some clarification is needed:\n
${message}\n
\n
You can reply to this email and your message will be passed along.\n
\n
Note: Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.`;

  return { subjectLine, bodyText };
}
