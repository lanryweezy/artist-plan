// Actions the AI can take on behalf of the user
// These map to Supabase database operations

export const aiActions = {
  // Project actions
  createProject: {
    description: "Create a new music project",
    parameters: {
      title: "string - Project name",
      type: "single | ep | album | mixtape | video | other",
      release_date: "string - YYYY-MM-DD (optional)",
      budget: "number - Budget in dollars (optional)",
    },
  },

  updateProject: {
    description: "Update an existing project",
    parameters: {
      id: "string - Project ID",
      status: "idea | writing | recording | mixing | mastering | artwork | distribution | released (optional)",
      progress: "number - 0 to 100 (optional)",
    },
  },

  // Task actions
  createTask: {
    description: "Create a task for a project",
    parameters: {
      title: "string - Task name",
      description: "string - Task details (optional)",
      project_id: "string - Associated project ID (optional)",
      priority: "low | medium | high",
      due_date: "string - YYYY-MM-DD (optional)",
    },
  },

  createMultipleTasks: {
    description: "Create multiple tasks at once (batch)",
    parameters: {
      tasks: "array - List of tasks with title, description, priority, due_date",
    },
  },

  updateTask: {
    description: "Update a task's status or details",
    parameters: {
      id: "string - Task ID",
      status: "todo | in_progress | review | done (optional)",
    },
  },

  // Finance actions
  addIncome: {
    description: "Record income received",
    parameters: {
      description: "string - Source of income",
      amount: "number - Amount in dollars",
      category: "string - Streaming | Live | Merch | Sponsorship | Other",
      project_id: "string - Related project (optional)",
    },
  },

  addExpense: {
    description: "Record an expense",
    parameters: {
      description: "string - What was spent on",
      amount: "number - Amount in dollars",
      category: "string - Production | Marketing | Travel | Tools | Other",
      project_id: "string - Related project (optional)",
    },
  },

  // Calendar actions
  createEvent: {
    description: "Create a calendar event",
    parameters: {
      title: "string - Event name",
      date: "string - YYYY-MM-DD",
      time: "string - HH:MM (optional)",
      type: "deadline | session | show | meeting | other",
      project_id: "string - Related project (optional)",
    },
  },

  // Content actions
  addContent: {
    description: "Add a content item",
    parameters: {
      title: "string - Content name",
      type: "audio | video | image | document | lyrics",
      project_id: "string - Related project (optional)",
      tags: "array - Tags for organization",
    },
  },

  // Tour actions
  createTour: {
    description: "Create a new tour",
    parameters: {
      name: "string - Tour name",
      start_date: "string - YYYY-MM-DD",
      end_date: "string - YYYY-MM-DD",
      budget: "number - Total budget (optional)",
    },
  },

  // Brand actions
  addBrandAsset: {
    description: "Add a brand asset (logo, color, font)",
    parameters: {
      name: "string - Asset name",
      type: "logo | color | font | image",
      value: "string - URL or hex code",
    },
  },

  // Marketing actions
  createCampaign: {
    description: "Create a marketing campaign",
    parameters: {
      name: "string - Campaign name",
      project_id: "string - Related project (optional)",
      budget: "number - Campaign budget (optional)",
      platforms: "array - Social platforms to target",
      start_date: "string - YYYY-MM-DD",
      end_date: "string - YYYY-MM-DD",
    },
  },

  // AI analysis actions
  analyzeFinances: {
    description: "Analyze spending patterns and suggest budget adjustments",
    parameters: {},
  },

  generateReleasePlan: {
    description: "Generate a complete release plan with timeline and tasks",
    parameters: {
      project_id: "string - Project to plan",
    },
  },

  generateMarketingPlan: {
    description: "Generate a marketing strategy for a project",
    parameters: {
      project_id: "string - Project to market",
      budget: "number - Marketing budget (optional)",
    },
  },
}

export type AIAction = keyof typeof aiActions
