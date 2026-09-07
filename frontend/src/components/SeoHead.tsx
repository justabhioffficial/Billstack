import React, { useEffect } from 'react';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'BillStack — Smart Expense & Receipt Management SaaS for Indian Freelancers & Small Businesses',
  description = 'Effortlessly capture receipts, extract total amounts and vendors with EasyOCR, track GST, identify spending patterns, and prepare CA audit reviews in seconds.',
  keywords = 'receipt management, expense tracker, India GST calculator, freelancer expenses, EasyOCR bill scanner, BillStack SaaS',
}) => {
  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
  }, [title, description, keywords]);

  return null;
};
