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

export function rejectFeedback({ feedback, message }) {
  const subjectLine = 'Suggestion Box: Feedback rejected';
  const bodyText =
    `Hi! This is your friend at Suggestion Box.\n\nThank you for submitting a feedback with Suggestion Box! Sadly, your feedback: "${feedback.text}" was rejected by your administrator.\n\nThe explanation we received was: "${message}"\n\nThere is no need to worry. Your contact information has been kept confidential. This message was written without knowledge of who sent the feedback.\n\nPlease don't let this rejection stop you from sending the next feedback! I hope to here your thoughts again soon!\n\nYour friend at Suggestion Box.`;
  return { subjectLine, bodyText };
}

export function rejectSolution({ solution, message }) {
  const subjectLine = 'Suggestion Box: Solution rejected';
  const bodyText = `Hi! This is your friend at Suggestion Box.\n\nThank you for proposing a solution with Suggestion Box! Sadly, your submission: "${solution.text}" was rejected by your administrator.\n\nThe explanation we received was: "${message}"\n\nThere is no need to worry. Your contact information has been kept confidential. This message was written without knowledge of who sent the solution.\n\nPlease don't let this rejection stop you from sending the next solution or feedback! I hope to here your thoughts again soon!\n\nYour friend at Suggestion Box.`;
  return { subjectLine, bodyText };
}

export function clarifyFeedback({ feedback, message }) {
  const subjectLine = 'Suggestion Box: Clarification needed';
  const bodyText =
    `Hi! This is your friend at Suggestion Box.\n\nThank you for submitting a feedback with Suggestion Box! Your administrator has requested for a clarification on your feedback: "${feedback.text}".\n\nThe note we received from your administrator was: "${message}"\n\nYour contact information has been kept confidential. This message was written without knowledge of who sent the feedback.\n\nYou can reply to this email and your message will be passed along. I hope to here more of your thoughts in the future!\n\nYour friend at Suggestion Box.`;
  return { subjectLine, bodyText };
}

export function clarifySolution({ solution, message }) {
  const subjectLine = 'Suggestion Box: Clarification needed';
  const bodyText =
      `Hi! This is your friend at Suggestion Box.\n\nThank you for proposing a solution with Suggestion Box! Your administrator has requested for a clarification on your solution: "${solution.text}".\n\nThe note we received from your administrator was: "${message}"\n\nYour contact information has been kept confidential. This message was written without knowledge of who sent the solution.\n\nYou can reply to this email and your message will be passed along. I hope to here more of your thoughts in the future!\n\nYour friend at Suggestion Box.`;
  return { subjectLine, bodyText };
}
