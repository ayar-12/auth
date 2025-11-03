// utils/quizUtils.js

// Common question IDs for easy reference
export const QUESTION_IDS = {
  HAIR_TYPE: 'hairType',
  SCALP: 'scalp',
  CONCERNS: 'concerns',
  GOALS: 'goals',
  INGREDIENTS: 'ingredients',
};

// Common answer options
export const ANSWER_OPTIONS = {
  hairType: ['Straight', 'Wavy', 'Curly', 'Coily'],
  scalp: ['Oily', 'Dry', 'Balanced', 'Sensitive'],
  concerns: [
    'Frizz',
    'Breakage',
    'Dandruff',
    'Hair fall',
    'Lack of volume',
    'Color protection',
    'Split ends',
    'Dullness',
  ],
  goals: [
    'Shine',
    'Strength',
    'Growth',
    'Moisture',
    'Definition',
    'Scalp health',
    'Volume',
    'Damage repair',
  ],
  ingredients: [
    'Coconut',
    'Amla',
    'Argan',
    'Shea',
    'Keratin',
    'Aloe',
    'Tea Tree',
    'Jojoba',
  ],
};

// Template questions for quick setup
export const TEMPLATE_QUESTIONS = [
  {
    id: 'hairType',
    title: "What's your hair type?",
    options: ANSWER_OPTIONS.hairType,
    required: true,
    multiple: false,
    order: 1,
    isActive: true,
  },
  {
    id: 'scalp',
    title: "What's your scalp like?",
    options: ANSWER_OPTIONS.scalp,
    required: true,
    multiple: false,
    order: 2,
    isActive: true,
  },
  {
    id: 'concerns',
    title: 'What are your top hair concerns?',
    options: ANSWER_OPTIONS.concerns,
    multiple: true,
    required: true,
    order: 3,
    isActive: true,
  },
  {
    id: 'goals',
    title: "What's your main hair goal?",
    options: ANSWER_OPTIONS.goals,
    required: true,
    multiple: false,
    order: 4,
    isActive: true,
  },
  {
    id: 'ingredients',
    title: 'Any favorite ingredients?',
    options: ANSWER_OPTIONS.ingredients,
    multiple: true,
    required: false,
    order: 5,
    isActive: true,
  },
];

// Template recommendation rules
export const TEMPLATE_RULES = [
  {
    name: 'Curly Hair with Frizz',
    description: 'Anti-frizz and curl-defining products for curly hair',
    conditions: {
      hairType: 'Curly',
      concerns: { $in: ['Frizz'] },
    },
    priority: 10,
    isActive: true,
  },
  {
    name: 'Oily Scalp Balance',
    description: 'Clarifying and balancing products for oily scalp',
    conditions: {
      scalp: 'Oily',
    },
    priority: 8,
    isActive: true,
  },
  {
    name: 'Dry Hair Moisture',
    description: 'Deep conditioning products for dry hair seeking moisture',
    conditions: {
      scalp: 'Dry',
      goals: 'Moisture',
    },
    priority: 9,
    isActive: true,
  },
  {
    name: 'Hair Fall Prevention',
    description: 'Strengthening products for hair fall concerns',
    conditions: {
      concerns: { $in: ['Hair fall'] },
    },
    priority: 10,
    isActive: true,
  },
  {
    name: 'Color Protection',
    description: 'Color-safe products for treated hair',
    conditions: {
      concerns: { $in: ['Color protection'] },
    },
    priority: 7,
    isActive: true,
  },
  {
    name: 'Sensitive Scalp Care',
    description: 'Gentle products for sensitive scalp',
    conditions: {
      scalp: 'Sensitive',
    },
    priority: 9,
    isActive: true,
  },
  {
    name: 'Volume Boost',
    description: 'Volumizing products for fine or flat hair',
    conditions: {
      concerns: { $in: ['Lack of volume'] },
      goals: 'Volume',
    },
    priority: 8,
    isActive: true,
  },
];

// Helper function to validate quiz answers
export const validateQuizAnswers = (answers, questions) => {
  const errors = [];

  questions.forEach((question) => {
    const answer = answers[question.id];

    // Check required fields
    if (question.required) {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        errors.push(`${question.title} is required`);
      }
    }

    // Validate answer format
    if (answer) {
      if (question.multiple && !Array.isArray(answer)) {
        errors.push(`${question.title} should have multiple selections`);
      }
      if (!question.multiple && Array.isArray(answer)) {
        errors.push(`${question.title} should have only one selection`);
      }
    }

    // Validate options
    if (answer) {
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const invalidOptions = answerArray.filter(
        (a) => !question.options.includes(a)
      );
      if (invalidOptions.length > 0) {
        errors.push(
          `Invalid options for ${question.title}: ${invalidOptions.join(', ')}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to format condition for display
export const formatCondition = (key, value) => {
  if (value?.$in) {
    return `${key} contains: ${value.$in.join(', ')}`;
  }
  return `${key} equals: ${value}`;
};

// Helper function to calculate quiz completion percentage
export const calculateCompletion = (answers, questions) => {
  const requiredQuestions = questions.filter((q) => q.required);
  const answeredRequired = requiredQuestions.filter((q) => {
    const answer = answers[q.id];
    return answer && (!Array.isArray(answer) || answer.length > 0);
  });

  return Math.round((answeredRequired.length / requiredQuestions.length) * 100);
};

// Helper function to generate explanation text
export const generateExplanation = (answers) => {
  const hairType = answers.hairType || 'your hair';
  const scalp = answers.scalp || 'your scalp type';
  const concerns = Array.isArray(answers.concerns)
    ? answers.concerns.join(' and ')
    : answers.concerns || 'your concerns';
  const goals = answers.goals || 'your hair goals';

  return `Based on your ${hairType.toLowerCase()} hair and ${scalp.toLowerCase()} scalp, with concerns about ${concerns.toLowerCase()}, we've curated a personalized routine focused on ${goals.toLowerCase()}. These products work together to address your specific needs while maintaining healthy, beautiful hair.`;
};

// Helper function to match rules with answers
export const matchRulesWithAnswers = (answers, rules) => {
  return rules.filter((rule) => {
    if (!rule.isActive) return false;

    return Object.entries(rule.conditions).every(([key, condition]) => {
      const answer = answers[key];

      if (condition.$in) {
        // Array contains condition
        if (Array.isArray(answer)) {
          return condition.$in.some((val) => answer.includes(val));
        } else {
          return condition.$in.includes(answer);
        }
      } else {
        // Exact match condition
        return answer === condition;
      }
    });
  });
};

// Priority levels for rules
export const PRIORITY_LEVELS = {
  CRITICAL: 10,
  HIGH: 8,
  MEDIUM: 5,
  LOW: 3,
  MINIMAL: 1,
};

// Status colors for UI
export const STATUS_COLORS = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  error: 'error',
};

// Chart colors for analytics
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#ed6c02',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1',
};

// Export all utilities
export default {
  QUESTION_IDS,
  ANSWER_OPTIONS,
  TEMPLATE_QUESTIONS,
  TEMPLATE_RULES,
  validateQuizAnswers,
  formatCondition,
  calculateCompletion,
  generateExplanation,
  matchRulesWithAnswers,
  PRIORITY_LEVELS,
  STATUS_COLORS,
  CHART_COLORS,
};

// ============================================
// Usage Examples
// ============================================

/*
// 1. Validate answers before submission
import { validateQuizAnswers } from './utils/quizUtils';

const { isValid, errors } = validateQuizAnswers(userAnswers, questions);
if (!isValid) {
  console.error('Validation errors:', errors);
}

// 2. Generate explanation
import { generateExplanation } from './utils/quizUtils';

const explanation = generateExplanation(userAnswers);
console.log(explanation);

// 3. Calculate completion
import { calculateCompletion } from './utils/quizUtils';

const progress = calculateCompletion(answers, questions);
console.log(`Quiz ${progress}% complete`);

// 4. Use templates for quick setup
import { TEMPLATE_QUESTIONS, TEMPLATE_RULES } from './utils/quizUtils';

// Seed with templates
await QuizQuestion.insertMany(TEMPLATE_QUESTIONS);
await QuizRecommendationRule.insertMany(TEMPLATE_RULES);

// 5. Format conditions for display
import { formatCondition } from './utils/quizUtils';

const display = formatCondition('hairType', 'Curly');
// Output: "hairType equals: Curly"

const display2 = formatCondition('concerns', { $in: ['Frizz', 'Breakage'] });
// Output: "concerns contains: Frizz, Breakage"
*/