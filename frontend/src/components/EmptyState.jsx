import React from 'react';
import { FileCheck, Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="empty-state-panel">
      <div className="empty-state-icon-box">
        <FileCheck size={28} />
      </div>
      <h3>Ready to Analyze</h3>
      <p>
        Complete the applicant profile above and run the AI prediction to generate an instant retail credit decision, probability scores, and risk graphs.
      </p>
    </div>
  );
}
