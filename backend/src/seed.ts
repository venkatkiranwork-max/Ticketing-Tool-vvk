import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from './config/env.js';

import { User } from './models/User.model.js';
import { TeamModel as Team } from './models/Team.model.js';
import { Project } from './models/Project.model.js';
import { Issue } from './models/Issue.model.js';
import { Notification } from './models/Notification.model.js';
import { Workspace } from './models/Workspace.model.js';

const MONGO_URI = env.mongodbUri;

async function seedDatabase() {
  try {
    console.info(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.info('MongoDB connected successfully.');

    // 1. Clear existing data completely
    console.info('Deleting all existing users, teams, projects, issues, notifications, workspaces...');
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Project.deleteMany({}),
      Issue.deleteMany({}),
      Notification.deleteMany({}),
      Workspace.deleteMany({}),
    ]);

    // 2. Hash default password: Password123!
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // 3. Seed Exactly 3 Users (Suresh, Ravi, Mani)
    console.info('Seeding 3 Enterprise Users (Suresh - Super Admin, Ravi - Admin, Mani - PM)...');
    const superAdmin = await User.create({
      email: 'suresh@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Suresh',
      lastName: 'Kumar',
      employeeId: 'EMP-1001',
      role: 'Super Admin',
      team: 'IT',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'IT',
      phone: '+91 98765 43210',
      location: 'Bangalore, IN',
      bio: 'Chief Technology Officer overseeing platform architecture, IT infrastructure, and security governance.',
      joinDate: new Date('2024-01-10'),
    });

    const admin = await User.create({
      email: 'ravi@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Ravi',
      lastName: 'Sharma',
      employeeId: 'EMP-1002',
      role: 'Admin',
      team: 'UI/UX',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      department: 'UI/UX Design',
      phone: '+91 98765 43211',
      location: 'Mumbai, IN',
      bio: 'Director of Design Operations managing UI/UX design systems and team delivery.',
      joinDate: new Date('2024-02-01'),
    });

    const pm = await User.create({
      email: 'mani@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'Mani',
      lastName: 'Verma',
      employeeId: 'EMP-1003',
      role: 'Project Manager',
      team: 'Testing',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Testing & QA',
      phone: '+91 98765 43212',
      location: 'Hyderabad, IN',
      bio: 'Lead PM driving quality assurance pipelines, automated testing, and sprint delivery.',
      joinDate: new Date('2024-03-15'),
    });

    // 4. Seed Workspace
    console.info('Seeding Core Workspace...');
    const workspace = await Workspace.create({
      name: 'ABC Tech Workspace',
      slug: 'abc-tech',
      description: 'Primary corporate engineering workspace.',
      ownerId: superAdmin._id,
      members: [
        { userId: superAdmin._id, role: 'owner', joinedAt: new Date() },
        { userId: admin._id, role: 'admin', joinedAt: new Date() },
        { userId: pm._id, role: 'member', joinedAt: new Date() },
      ],
    });

    // 5. Seed Default Teams (IT, UI/UX, Testing)
    console.info('Seeding Default Teams (IT, UI/UX, Testing)...');
    await Team.create([
      {
        name: 'IT',
        description: 'IT infrastructure, server management, distributed cloud, and corporate network security.',
        teamLeadId: superAdmin._id.toString(),
        teamLeadName: `${superAdmin.firstName} ${superAdmin.lastName}`,
        memberCount: 5,
        projectCount: 2,
        velocity: 42,
        currentSprint: 'Sprint 24',
      },
      {
        name: 'UI/UX',
        description: 'Design system primitives, accessibility token guidelines, user interface research, and Figma tokens.',
        teamLeadId: admin._id.toString(),
        teamLeadName: `${admin.firstName} ${admin.lastName}`,
        memberCount: 4,
        projectCount: 2,
        velocity: 35,
        currentSprint: 'Sprint 24',
      },
      {
        name: 'Testing',
        description: 'End-to-end integration testing, manual QA suites, performance regression, and Playwright automation.',
        teamLeadId: pm._id.toString(),
        teamLeadName: `${pm.firstName} ${pm.lastName}`,
        memberCount: 4,
        projectCount: 2,
        velocity: 38,
        currentSprint: 'Sprint 24',
      },
    ]);

    // 6. Seed Core Project
    console.info('Seeding 1 Core Enterprise Project...');
    const project = await Project.create({
      name: 'Enterprise Platform Core',
      slug: 'enterprise-platform-core',
      description: 'Next-generation ticket management platform, real-time board updates, and RBAC governance engine.',
      team: 'IT',
      sprint: 'Sprint 24',
      workspaceId: workspace._id,
      members: [
        {
          userId: superAdmin._id,
          userName: `${superAdmin.firstName} ${superAdmin.lastName}`,
          userEmail: superAdmin.email,
          projectRole: 'Project Admin',
        },
        {
          userId: admin._id,
          userName: `${admin.firstName} ${admin.lastName}`,
          userEmail: admin.email,
          projectRole: 'Lead Developer',
        },
        {
          userId: pm._id,
          userName: `${pm.firstName} ${pm.lastName}`,
          userEmail: pm.email,
          projectRole: 'Developer',
        },
      ],
      status: 'active',
    });

    // 7. Seed Core Issues
    console.info('Seeding Project Issues...');
    await Issue.create([
      {
        key: 'EPR-101',
        title: 'Implement Enterprise RBAC & Screen Access Matrix',
        description: 'Configure per-user screen visibility toggles and strict backend 403 route protection.',
        type: 'story',
        status: 'in_progress',
        priority: 'critical',
        assigneeId: pm._id,
        assigneeName: `${pm.firstName} ${pm.lastName}`,
        reporterId: superAdmin._id,
        reporterName: `${superAdmin.firstName} ${superAdmin.lastName}`,
        projectId: project._id,
        projectName: project.name,
        workspaceId: workspace._id,
        sprint: 'Sprint 24',
        dueDate: new Date('2026-08-01'),
        labels: ['Security', 'RBAC'],
        storyPoints: 8,
        checklist: [],
        comments: [],
        attachments: [],
        history: [],
      },
      {
        key: 'EPR-102',
        title: 'Setup Automated Security Audit Logging Pipeline',
        description: 'Record administrative state changes and account lockout events to persistent audit trail.',
        type: 'task',
        status: 'todo',
        priority: 'high',
        assigneeId: superAdmin._id,
        assigneeName: `${superAdmin.firstName} ${superAdmin.lastName}`,
        reporterId: admin._id,
        reporterName: `${admin.firstName} ${admin.lastName}`,
        projectId: project._id,
        projectName: project.name,
        workspaceId: workspace._id,
        sprint: 'Sprint 24',
        dueDate: new Date('2026-08-05'),
        labels: ['Audit', 'Backend'],
        storyPoints: 5,
        checklist: [],
        comments: [],
        attachments: [],
        history: [],
      },
    ]);

    console.info('====================================================');
    console.info('Database seeded successfully!');
    console.info('Active Accounts Created:');
    console.info('1. Super Admin: suresh@gmail.com / Password123!');
    console.info('2. Admin:       ravi@gmail.com / Password123!');
    console.info('3. PM (Other):  mani@gmail.com / Password123!');
    console.info('====================================================');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
