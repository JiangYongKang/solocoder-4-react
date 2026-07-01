import React from 'react';

export default function Steps({ currentStep }) {
  const steps = [
    { key: 0, label: '搜索酒店' },
    { key: 1, label: '填写信息' },
    { key: 2, label: '确认订单' },
    { key: 3, label: '预订完成' },
  ];

  return (
    <div className="hb-steps">
      {steps.map((step, idx) => {
        let cls = '';
        if (idx < currentStep) cls = 'done';
        else if (idx === currentStep) cls = 'active';

        return (
          <div key={step.key} className={`hb-step ${cls}`}>
            <span className="hb-step-num">
              {idx < currentStep ? '✓' : idx + 1}
            </span>
            <span className="hb-step-text">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
