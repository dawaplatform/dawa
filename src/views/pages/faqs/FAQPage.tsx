'use client';

import * as React from 'react';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFaqs } from '@/@core/hooks/useProductData';
import { OopsComponent } from '@/components/shared/oops-component';
import Loader from '@/components/features/loaders/SubLoader';

/**
 * FAQPage Component
 */
export default function FAQPage() {
  const { faqsData, isLoading, isError } = useFaqs();

  // Local states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedQuestionId, setSelectedQuestionId] = React.useState<
    string | null
  >(null);

  // When a question is selected, scroll to the top smoothly.
  React.useEffect(() => {
    if (selectedQuestionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedQuestionId]);

  // Extract the array of FAQs from the API response.
  // If `faqsData` is already an array, use it directly;
  // otherwise assume the array is in `faqsData.data`.
  const faqsArray = Array.isArray(faqsData) ? faqsData : faqsData?.data || [];

  // Group FAQs by category
  const groupedCategories = React.useMemo(() => {
    const groups: Record<
      string,
      {
        id: string;
        title: string;
        questions: { id: string; title: string; content: string }[];
      }
    > = {};

    faqsArray.forEach((faq: any) => {
      const category = faq.category || 'Other';
      if (!groups[category]) {
        groups[category] = {
          id: category,
          title: category,
          questions: [],
        };
      }
      groups[category].questions.push({
        id: String(faq.id),
        title: faq.question,
        content: faq.answer,
      });
    });

    return Object.values(groups);
  }, [faqsArray]);

  // Deep Search in both question title & content
  const filteredCategories = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return groupedCategories
      .map((category) => {
        const filteredQuestions = category.questions.filter((q) => {
          const inTitle = q.title.toLowerCase().includes(query);
          const inContent = q.content.toLowerCase().includes(query);
          return inTitle || inContent;
        });
        return {
          ...category,
          questions: filteredQuestions,
        };
      })
      .filter((category) => category.questions.length > 0);
  }, [groupedCategories, searchQuery]);

  // Find the currently selected question among all categories
  const selectedQuestion = React.useMemo(() => {
    for (const cat of groupedCategories) {
      const found = cat.questions.find((q) => q.id === selectedQuestionId);
      if (found) return found;
    }
    return null;
  }, [groupedCategories, selectedQuestionId]);

  // Loading & Error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <OopsComponent
        title="Oops! Something went wrong"
        description="We're having trouble loading the data. Please try again."
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  /**
   * Renders the left column (search + categories + questions)
   * for desktop and also for mobile (when no question is selected).
   */
  const renderCategoryList = () => (
    <div className="bg-white border rounded-md p-2 md:p-4">
      {/* Search Box */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search questions or answers"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* List of categories + questions without a fixed max-height */}
      <div>
        {filteredCategories.length === 0 ? (
          <p className="text-gray-500">No questions found.</p>
        ) : (
          filteredCategories.map((category, idx) => (
            <div key={category.id} className="mb-6">
              {/* Category Title */}
              <h3 className="text-xs font-semibold uppercase mb-2">
                {category.title}
              </h3>
              {/* Questions */}
              <div className="space-y-1">
                {category.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={cn(
                      'w-full flex items-center justify-between text-left px-3 py-2 rounded transition-colors border border-transparent',
                      selectedQuestionId === q.id
                        ? 'bg-primary_1/10 text-primary_1 font-medium'
                        : 'hover:bg-primary_1/5',
                    )}
                  >
                    <span>{q.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Horizontal line to separate categories, except after last */}
              {idx < filteredCategories.length - 1 && (
                <hr className="mt-4 border-t border-gray-200" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  /**
   * Renders the right column (selected question & answer)
   * for desktop and for mobile (when a question is selected).
   */
  const renderSelectedQuestion = () => (
    <div className="bg-white border rounded-md p-2 md:p-4">
      {selectedQuestion ? (
        <>
          <h2 className="text-lg font-semibold mb-4 text-primary_1">
            {selectedQuestion.title}
          </h2>
          <div className="prose">{selectedQuestion.content}</div>
        </>
      ) : (
        <p className="text-gray-500">Select a question to view the answer</p>
      )}
    </div>
  );

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>

      {/* ======================
          MOBILE LAYOUT
          ====================== */}
      <div className="block md:hidden">
        {/* If user hasn't selected a question, show categories & questions */}
        {!selectedQuestion ? (
          renderCategoryList()
        ) : (
          /* If user selected a question, show the question detail in a full page */
          <div className="bg-white border rounded-md p-2 md:p-4 relative">
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="mb-4 flex items-center text-primary_1 hover:text-primary_1/80"
            >
              <ArrowLeft className="mr-2" />
              <span>Back</span>
            </button>
            <h2 className="text-lg font-semibold mb-4 text-primary_1">
              {selectedQuestion.title}
            </h2>
            <div className="prose">{selectedQuestion.content}</div>
          </div>
        )}
      </div>

      {/* ======================
          DESKTOP LAYOUT
          ====================== */}
      <div className="hidden md:grid grid-cols-[300px_minmax(0,1fr)] gap-4">
        {/* LEFT COLUMN: category list */}
        {renderCategoryList()}
        {/* RIGHT COLUMN: selected question & answer */}
        {renderSelectedQuestion()}
      </div>
    </div>
  );
}
