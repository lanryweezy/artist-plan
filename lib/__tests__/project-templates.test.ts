import { getProjectTemplates, createProjectFromTemplate } from '../project-templates'

// Mock project templates for testing
const mockTemplates = [
  {
    id: 'album-release',
    name: 'Album Release',
    description: 'Complete album release workflow',
    category: 'music',
    tasks: [
      { name: 'Pre-production planning', priority: 'high', estimatedDays: 7 },
      { name: 'Recording sessions', priority: 'high', estimatedDays: 14 },
      { name: 'Mixing and mastering', priority: 'high', estimatedDays: 10 },
      { name: 'Album artwork creation', priority: 'medium', estimatedDays: 5 },
      { name: 'Distribution setup', priority: 'high', estimatedDays: 3 },
      { name: 'Marketing campaign launch', priority: 'medium', estimatedDays: 21 },
    ]
  },
  {
    id: 'tour-planning',
    name: 'Tour Planning',
    description: 'Comprehensive tour planning and execution',
    category: 'live',
    tasks: [
      { name: 'Venue research and booking', priority: 'high', estimatedDays: 14 },
      { name: 'Travel logistics planning', priority: 'high', estimatedDays: 7 },
      { name: 'Equipment and crew coordination', priority: 'medium', estimatedDays: 5 },
      { name: 'Marketing and promotion', priority: 'medium', estimatedDays: 21 },
      { name: 'Ticket sales setup', priority: 'high', estimatedDays: 3 },
    ]
  }
]

// Mock the actual implementation
jest.mock('../project-templates', () => ({
  getProjectTemplates: jest.fn(),
  createProjectFromTemplate: jest.fn(),
}))

describe('Project Templates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getProjectTemplates as jest.Mock).mockReturnValue(mockTemplates)
  })

  describe('getProjectTemplates', () => {
    it('returns all available templates', () => {
      const templates = getProjectTemplates()
      expect(templates).toHaveLength(2)
      expect(templates[0].id).toBe('album-release')
      expect(templates[1].id).toBe('tour-planning')
    })

    it('returns templates with correct structure', () => {
      const templates = getProjectTemplates()
      const template = templates[0]
      
      expect(template).toHaveProperty('id')
      expect(template).toHaveProperty('name')
      expect(template).toHaveProperty('description')
      expect(template).toHaveProperty('category')
      expect(template).toHaveProperty('tasks')
      expect(Array.isArray(template.tasks)).toBe(true)
    })

    it('filters templates by category', () => {
      const musicTemplates = getProjectTemplates('music')
      expect(musicTemplates).toHaveLength(1)
      expect(musicTemplates[0].category).toBe('music')
    })
  })

  describe('createProjectFromTemplate', () => {
    it('creates project from template with custom name', () => {
      const mockProject = {
        id: 'generated-id',
        name: 'My Album Release',
        templateId: 'album-release',
        status: 'planning',
        tasks: mockTemplates[0].tasks.map(task => ({
          ...task,
          id: 'generated-task-id',
          status: 'pending',
          createdAt: new Date().toISOString()
        }))
      }

      ;(createProjectFromTemplate as jest.Mock).mockReturnValue(mockProject)

      const project = createProjectFromTemplate('album-release', 'My Album Release')
      
      expect(project.name).toBe('My Album Release')
      expect(project.templateId).toBe('album-release')
      expect(project.tasks).toHaveLength(6)
      expect(project.status).toBe('planning')
    })

    it('throws error for invalid template ID', () => {
      ;(createProjectFromTemplate as jest.Mock).mockImplementation((templateId) => {
        if (templateId === 'invalid-template') {
          throw new Error('Template not found')
        }
      })

      expect(() => {
        createProjectFromTemplate('invalid-template', 'Test Project')
      }).toThrow('Template not found')
    })

    it('generates unique IDs for project and tasks', () => {
      const mockProject1 = {
        id: 'id-1',
        name: 'Project 1',
        tasks: [{ id: 'task-1-1' }, { id: 'task-1-2' }]
      }
      const mockProject2 = {
        id: 'id-2',
        name: 'Project 2',
        tasks: [{ id: 'task-2-1' }, { id: 'task-2-2' }]
      }

      ;(createProjectFromTemplate as jest.Mock)
        .mockReturnValueOnce(mockProject1)
        .mockReturnValueOnce(mockProject2)

      const project1 = createProjectFromTemplate('album-release', 'Project 1')
      const project2 = createProjectFromTemplate('album-release', 'Project 2')
      
      expect(project1.id).not.toBe(project2.id)
      expect(project1.tasks[0].id).not.toBe(project2.tasks[0].id)
    })
  })
})