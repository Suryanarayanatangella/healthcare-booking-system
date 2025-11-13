/**
 * Typography Showcase Component
 * 
 * A component to showcase the improved typography and font visibility
 * across different text styles and use cases.
 */

import React from 'react';

const TypographyShowcase = () => {
  return (
    <div className="max-w-full mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Enhanced Typography System
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Professional typography with improved readability and accessibility
        </p>
      </div>

      {/* Headings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Heading Hierarchy
        </h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Heading 1 - Main Title</h1>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Heading 2 - Section Title</h2>
          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Heading 3 - Subsection</h3>
          <h4 className="text-xl font-semibold text-gray-900 tracking-tight">Heading 4 - Component Title</h4>
          <h5 className="text-lg font-medium text-gray-900">Heading 5 - Card Title</h5>
          <h6 className="text-base font-medium text-gray-900">Heading 6 - Label</h6>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Body Text Styles
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            <strong>Large Body Text:</strong> This is used for important content that needs emphasis. 
            It has excellent readability with proper line height and letter spacing.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            <strong>Regular Body Text:</strong> This is the standard text used throughout the application. 
            It maintains good readability while being comfortable for extended reading.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            <strong>Small Text:</strong> Used for captions, metadata, and secondary information. 
            Still maintains readability at smaller sizes.
          </p>
        </div>
      </section>

      {/* Professional Text Classes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Professional Text Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-heading">Heading Text Class</p>
            <p className="text-body">Body Text Class</p>
            <p className="text-caption">Caption Text Class</p>
            <p className="text-label">LABEL TEXT CLASS</p>
          </div>
          <div className="space-y-3">
            <p className="readable-text">Readable Text Class</p>
            <p className="professional-text">Professional Text Class</p>
            <p className="subtle-text">Subtle Text Class</p>
          </div>
        </div>
      </section>

      {/* Contrast Levels */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Contrast Levels
        </h2>
        <div className="space-y-3">
          <p className="text-high-contrast">High Contrast Text - Perfect for headings and important content</p>
          <p className="text-medium-contrast">Medium Contrast Text - Great for body content and descriptions</p>
          <p className="text-low-contrast">Low Contrast Text - Ideal for subtle information and metadata</p>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Form Typography
        </h2>
        <div className="space-y-4">
          <div>
            <label className="form-label">Enhanced Form Label</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enhanced form input with better typography"
            />
          </div>
          <div>
            <label className="text-label">PROFESSIONAL LABEL STYLE</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Professional input styling"
            />
          </div>
        </div>
      </section>

      {/* Cards with Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
          Card Typography Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 dark:bg-gray-900">
            <h3 className="text-heading text-lg mb-3">Doctor Information</h3>
            <p className="professional-text mb-2">Dr. Sarah Johnson</p>
            <p className="text-caption mb-2">Cardiology Specialist</p>
            <p className="subtle-text">15 years of experience in cardiovascular medicine</p>
          </div>
          <div className="card p-6 dark:bg-gray-900">
            <h3 className="text-heading text-lg mb-3">Appointment Details</h3>
            <p className="readable-text mb-2">Regular Checkup</p>
            <p className="text-medium-contrast mb-1">November 8, 2024 at 10:00 AM</p>
            <p className="text-low-contrast">Confirmation #12345</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypographyShowcase;