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
    console.info('Deleting existing teams, projects, issues, notifications, workspaces (users are preserved)...');
    await Promise.all([
      Team.deleteMany({}),
      Project.deleteMany({}),
      Issue.deleteMany({}),
      Notification.deleteMany({}),
      Workspace.deleteMany({}),
    ]);

    // 2. Hash default password: Password123!
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Helper to get or create user without wiping other users
    const getOrCreateUser = async (email: string, details: any) => {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return existing;
      }
      return await User.create({
        ...details,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
      });
    };

    // 3. Seed Exactly 9 Users (1 Super Admin, 2 Project Managers, 6 Members)
    console.info('Seeding 9 Enterprise Users (Suresh - Super Admin, Ravi/Venkatesh - PMs, 6 Members)...');
    
    const superAdmin = await getOrCreateUser('suresh@gmail.com', {
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

    const pm1 = await getOrCreateUser('ravi@gmail.com', {
      firstName: 'Ravi',
      lastName: 'Sharma',
      employeeId: 'EMP-1002',
      role: 'Project Manager',
      team: 'UI/UX',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      department: 'UI/UX Design',
      phone: '+91 98765 43211',
      location: 'Mumbai, IN',
      bio: 'Director of Design Operations managing UI/UX design systems and team delivery.',
      joinDate: new Date('2024-02-01'),
    });

    const pm2 = await getOrCreateUser('venkatesh.aduri@gmail.com', {
      firstName: 'venkatesh',
      lastName: 'aduri',
      employeeId: 'EMP-1005',
      role: 'Project Manager',
      team: 'Engineering',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      phone: '+91 98765 43214',
      location: 'Bangalore, IN',
      bio: 'Enterprise Project Manager leading backends engineering.',
      joinDate: new Date('2024-04-05'),
    });

    const mem1 = await getOrCreateUser('mani@gmail.com', {
      firstName: 'Mani',
      lastName: 'Verma',
      employeeId: 'EMP-1003',
      role: 'Member',
      team: 'Testing',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Testing & QA',
      phone: '+91 98765 43212',
      location: 'Hyderabad, IN',
      bio: 'Lead QA driving quality assurance pipelines, automated testing, and sprint delivery.',
      joinDate: new Date('2024-03-15'),
    });

    const mem2 = await getOrCreateUser('venkatkiran@gmail.com', {
      firstName: 'v',
      lastName: 'venkatkiran',
      employeeId: 'EMP-1004',
      role: 'Member',
      team: 'Engineering',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      phone: '+91 98765 43213',
      location: 'Hyderabad, IN',
      bio: 'Fullstack developer member specializing in APIs and UI integrations.',
      joinDate: new Date('2024-04-01'),
    });

    const mem3 = await getOrCreateUser('sarah@gmail.com', {
      firstName: 'Sarah',
      lastName: 'Chen',
      employeeId: 'EMP-1006',
      role: 'Member',
      team: 'Engineering',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      phone: '+91 98765 43215',
      location: 'Bangalore, IN',
      bio: 'Lead frontend engineer specialized in React, TS and high performance charts.',
      joinDate: new Date('2024-04-10'),
    });

    const mem4 = await getOrCreateUser('david@gmail.com', {
      firstName: 'David',
      lastName: 'Kim',
      employeeId: 'EMP-1007',
      role: 'Member',
      team: 'IT',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80',
      department: 'IT Support',
      phone: '+91 98765 43216',
      location: 'Seoul, KR',
      bio: 'IT Operations specialist managing Sentinel Redis clusters.',
      joinDate: new Date('2024-04-15'),
    });

    const mem5 = await getOrCreateUser('elena@gmail.com', {
      firstName: 'Elena',
      lastName: 'Rostova',
      employeeId: 'EMP-1008',
      role: 'Member',
      team: 'UI/UX',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'UI/UX Design',
      phone: '+91 98765 43217',
      location: 'Prague, CZ',
      bio: 'Figma and visual guidelines designer member.',
      joinDate: new Date('2024-04-20'),
    });

    const mem6 = await getOrCreateUser('marcus@gmail.com', {
      firstName: 'Marcus',
      lastName: 'Vance',
      employeeId: 'EMP-1009',
      role: 'Member',
      team: 'Testing',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      department: 'Testing & QA',
      phone: '+91 98765 43218',
      location: 'Austin, US',
      bio: 'Integration test suites automated developer.',
      joinDate: new Date('2024-04-25'),
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
        { userId: pm1._id, role: 'admin', joinedAt: new Date() },
        { userId: pm2._id, role: 'admin', joinedAt: new Date() },
        { userId: mem1._id, role: 'member', joinedAt: new Date() },
        { userId: mem2._id, role: 'member', joinedAt: new Date() },
        { userId: mem3._id, role: 'member', joinedAt: new Date() },
        { userId: mem4._id, role: 'member', joinedAt: new Date() },
        { userId: mem5._id, role: 'member', joinedAt: new Date() },
        { userId: mem6._id, role: 'member', joinedAt: new Date() },
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
        teamLeadId: pm1._id.toString(),
        teamLeadName: `${pm1.firstName} ${pm1.lastName}`,
        memberCount: 4,
        projectCount: 2,
        velocity: 35,
        currentSprint: 'Sprint 24',
      },
      {
        name: 'Testing',
        description: 'End-to-end integration testing, manual QA suites, performance regression, and Playwright automation.',
        teamLeadId: mem1._id.toString(),
        teamLeadName: `${mem1.firstName} ${mem1.lastName}`,
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
          userId: pm1._id,
          userName: `${pm1.firstName} ${pm1.lastName}`,
          userEmail: pm1.email,
          projectRole: 'Lead Developer',
        },
        {
          userId: mem1._id,
          userName: `${mem1.firstName} ${mem1.lastName}`,
          userEmail: mem1.email,
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
        assigneeId: mem1._id,
        assigneeName: `${mem1.firstName} ${mem1.lastName}`,
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
        reporterId: pm1._id,
        reporterName: `${pm1.firstName} ${pm1.lastName}`,
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
    console.info('Active Accounts Created (Pass: Password123!):');
    console.info('1. Super Admin:       suresh@gmail.com');
    console.info('2. Project Manager 1: ravi@gmail.com');
    console.info('3. Project Manager 2: venkatesh.aduri@gmail.com');
    console.info('4. Member 1:          mani@gmail.com');
    console.info('5. Member 2:          venkatkiran@gmail.com');
    console.info('6. Member 3:          sarah@gmail.com');
    console.info('7. Member 4:          david@gmail.com');
    console.info('8. Member 5:          elena@gmail.com');
    console.info('9. Member 6:          marcus@gmail.com');
    console.info('====================================================');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
