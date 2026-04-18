import { PrismaClient, IssueStatus, Priority, Severity } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_ISSUES: {
  title: string
  description: string
  status: IssueStatus
  priority: Priority
  severity: Severity
}[] = [
  {
    title: 'Login page crashes on mobile Safari',
    description:
      'Users on iOS 16+ Safari report a white screen after submitting the login form. The error in console reads "Cannot read properties of undefined (reading \'token\')".\n\nSteps to reproduce:\n1. Open Safari on iOS 16\n2. Navigate to /login\n3. Enter valid credentials\n4. Tap "Sign in"\n\nExpected: Redirect to dashboard\nActual: White screen / crash',
    status: 'OPEN',
    priority: 'CRITICAL',
    severity: 'CRITICAL',
  },
  {
    title: 'Dashboard stats not updating after issue creation',
    description:
      'After creating a new issue, the stat cards on the dashboard still show stale counts. A manual page refresh is needed to see the updated numbers.\n\nThis is a UX regression introduced in v1.3.2.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    severity: 'MEDIUM',
  },
  {
    title: 'Pagination resets to page 1 when sorting changes',
    description:
      'When on page 3+ of the issues list and the user changes the sort order, pagination jumps back to page 1 but the URL does not reflect this change, causing confusion.',
    status: 'OPEN',
    priority: 'MEDIUM',
    severity: 'LOW',
  },
  {
    title: 'Export CSV includes HTML entities in description field',
    description:
      'Special characters like &amp;, &lt;, and &gt; in issue descriptions are not decoded before being written to the CSV export, resulting in corrupted data in Excel.',
    status: 'OPEN',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
  },
  {
    title: 'Password reset email link expires too quickly',
    description:
      'The password reset link is set to expire after 5 minutes which is too short. Users report the link being expired by the time they check their email. Recommend extending to 30 minutes.',
    status: 'RESOLVED',
    priority: 'LOW',
    severity: 'LOW',
  },
  {
    title: 'Search results highlight does not match query',
    description:
      'When searching for a term, the highlighted text in results sometimes highlights different words than the search query. This appears to be a regex escaping issue with special characters.',
    status: 'OPEN',
    priority: 'LOW',
    severity: 'LOW',
  },
  {
    title: 'API rate limiting not working under load',
    description:
      'Under concurrent load testing, the rate limiter allows more requests than configured. This is a security concern. The issue seems to be with the in-memory store not being shared across worker threads.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    severity: 'HIGH',
  },
  {
    title: 'Issue detail page 404 on direct URL access',
    description:
      'Directly navigating to /issues/:id via URL (e.g. sharing the link) results in a 404 error. The page only works when navigated to from within the app. This is a client-side routing config issue.',
    status: 'RESOLVED',
    priority: 'HIGH',
    severity: 'HIGH',
  },
  {
    title: 'Filter state not persisted across browser sessions',
    description:
      'Applied filters (status, priority, severity) are cleared when the user closes and reopens the browser. Expected behaviour is for filters to persist, as they do in similar tools like Linear and Jira.',
    status: 'OPEN',
    priority: 'LOW',
    severity: 'LOW',
  },
  {
    title: 'Sidebar collapses unexpectedly on 1280px screen width',
    description:
      'On screens exactly 1280px wide (a common laptop resolution), the sidebar randomly collapses to icon-only mode even though there is enough horizontal space for the full sidebar.',
    status: 'CLOSED',
    priority: 'LOW',
    severity: 'LOW',
  },
  {
    title: 'JWT tokens not invalidated on password change',
    description:
      'When a user changes their password, existing JWT tokens remain valid until their natural expiry. All active sessions should be invalidated immediately upon password change for security.',
    status: 'OPEN',
    priority: 'HIGH',
    severity: 'HIGH',
  },
  {
    title: 'Drag-and-drop status board causes data loss',
    description:
      'In the Kanban view, rapidly dragging cards between columns causes the underlying data to desync. In rare cases, issue status is overwritten with the previous state instead of the new one.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    severity: 'CRITICAL',
  },
]

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@zyra.test' },
    update: {},
    create: {
      name: 'Ranil Wickremesinghe',
      email: 'demo@zyra.test',
      password: hashedPassword,
    },
  })

  console.log(`✅ Demo user created: ${user.email}`)
  console.log(`   Password: password123\n`)

  // Create a second user
  const user2 = await prisma.user.upsert({
    where: { email: 'mahinda@zyra.test' },
    update: {},
    create: {
      name: 'Mahinda Rajapaksa',
      email: 'mahinda@zyra.test',
      password: hashedPassword,
    },
  })

  console.log(`✅ Second user created: ${user2.email}`)
  console.log(`   Password: password123\n`)

  // Delete existing issues seeded by this script
  await prisma.issue.deleteMany({
    where: { userId: { in: [user.id, user2.id] } },
  })

  // Create issues
  const userIds = [user.id, user2.id]
  for (let i = 0; i < DEMO_ISSUES.length; i++) {
    const issue = await prisma.issue.create({
      data: {
        ...DEMO_ISSUES[i],
        userId: userIds[i % 2],
      },
    })
    console.log(`  ✓ [${issue.priority.padEnd(8)}] ${issue.title.substring(0, 60)}`)
  }

  console.log(`\n🎉 Seeded ${DEMO_ISSUES.length} demo issues successfully!`)
  console.log('\n─────────────────────────────────────────')
  console.log('  Login at http://localhost:5173/login')
  console.log('  Email:    demo@zyra.test')
  console.log('  Password: password123')
  console.log('─────────────────────────────────────────\n')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
