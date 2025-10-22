import prisma from '../config/database';

const sampleProjects = [
  {
    name: 'E-Commerce Dashboard',
    description: 'A modern React dashboard for managing e-commerce operations with real-time analytics, inventory management, and order tracking.',
    language: 'TypeScript',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Redux'],
    githubUrl: 'https://github.com/example/ecommerce-dashboard',
    demoUrl: 'https://demo-ecommerce.example.com',
    isSample: true,
    tags: ['frontend', 'dashboard', 'e-commerce'],
  },
  {
    name: 'REST API with Authentication',
    description: 'Scalable Node.js REST API with JWT authentication, role-based access control, and comprehensive API documentation.',
    language: 'JavaScript',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    githubUrl: 'https://github.com/example/rest-api',
    isSample: true,
    tags: ['backend', 'api', 'authentication'],
  },
  {
    name: 'Machine Learning Pipeline',
    description: 'End-to-end ML pipeline for data preprocessing, model training, and deployment with Flask API for predictions.',
    language: 'Python',
    techStack: ['Python', 'TensorFlow', 'Flask', 'Pandas', 'scikit-learn'],
    githubUrl: 'https://github.com/example/ml-pipeline',
    isSample: true,
    tags: ['machine-learning', 'data-science', 'api'],
  },
  {
    name: 'Microservices Architecture',
    description: 'Distributed microservices system built with Spring Boot, featuring service discovery, load balancing, and API gateway.',
    language: 'Java',
    techStack: ['Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/example/microservices',
    isSample: true,
    tags: ['backend', 'microservices', 'devops'],
  },
  {
    name: 'CLI Task Manager',
    description: 'Fast and efficient command-line task manager built with Go, featuring task scheduling, reminders, and cloud sync.',
    language: 'Go',
    techStack: ['Go', 'Cobra', 'SQLite'],
    githubUrl: 'https://github.com/example/task-cli',
    isSample: true,
    tags: ['cli', 'productivity', 'tools'],
  },
  {
    name: 'Image Processing Library',
    description: 'High-performance image processing library written in Rust with SIMD optimizations and WebAssembly support.',
    language: 'Rust',
    techStack: ['Rust', 'WebAssembly', 'SIMD'],
    githubUrl: 'https://github.com/example/image-processor',
    isSample: true,
    tags: ['library', 'performance', 'image-processing'],
  },
  {
    name: 'Real-time Chat Application',
    description: 'Full-stack real-time chat application with WebSocket support, message history, and file sharing capabilities.',
    language: 'TypeScript',
    techStack: ['React', 'Socket.io', 'Node.js', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/example/chat-app',
    demoUrl: 'https://chat-demo.example.com',
    isSample: true,
    tags: ['fullstack', 'real-time', 'chat'],
  },
  {
    name: 'Mobile Fitness Tracker',
    description: 'Cross-platform mobile app for fitness tracking with workout plans, progress monitoring, and social features.',
    language: 'TypeScript',
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    githubUrl: 'https://github.com/example/fitness-tracker',
    isSample: true,
    tags: ['mobile', 'fitness', 'health'],
  },
];

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create tags
    const tagNames = new Set<string>();
    sampleProjects.forEach((project) => {
      project.tags.forEach((tag) => tagNames.add(tag));
    });

    const tags = await Promise.all(
      Array.from(tagNames).map(async (name) => {
        return prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      })
    );

    console.log(`Created ${tags.length} tags`);

    // Create projects
    for (const projectData of sampleProjects) {
      const { tags: projectTags, techStack, ...data } = projectData;

      const project = await prisma.project.create({
        data: {
          ...data,
          techStack: JSON.stringify(techStack),
        },
      });

      // Link tags
      for (const tagName of projectTags) {
        const tag = tags.find((t) => t.name === tagName);
        if (tag) {
          await prisma.projectTag.create({
            data: {
              projectId: project.id,
              tagId: tag.id,
            },
          });
        }
      }

      console.log(`Created project: ${project.name}`);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
