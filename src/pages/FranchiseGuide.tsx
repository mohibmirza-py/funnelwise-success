import React from 'react';
import Header from '@/components/Header';
import LeadForm from '@/components/LeadForm';
import StickyFooter from '@/components/StickyFooter';

const FranchiseGuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Franchise Guide Request</h1>
            <p className="text-xl text-gray-600">
              Get your comprehensive franchise guide by filling out the form below.
            </p>
          </div>
          
          <LeadForm 
            type="contact"
            title="Franchise Guide Request Form"
            showEbookCover={false}
          />
        </div>
      </main>
      
      <StickyFooter />
    </div>
  );
};

export default FranchiseGuidePage; 