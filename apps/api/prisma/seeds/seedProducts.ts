import { PrismaTransactionClient } from '../../src/lib/prisma/prisma.js';

async function seedProducts(prismaIntance: PrismaTransactionClient) {
    await prismaIntance.product.createMany({
        data: [
            {
                name: 'AI Code Assistant Pro',
                tagline: 'Write code 10x faster with AI-powered suggestions',
                description:
                    'An intelligent code completion tool that understands your project context and generates production-ready code snippets in real-time.',
                websiteUrl: 'https://aicode.dev',
                logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
                status: 'APPROVED',
            },
            {
                name: 'CloudSync Dashboard',
                tagline: 'Unified cloud infrastructure management across AWS, GCP, and Azure',
                description:
                    'Manage all your cloud resources from a single dashboard with cost optimization, security audits, and automated deployments.',
                websiteUrl: 'https://cloudsync.io',
                logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                status: 'APPROVED',
            },
            {
                name: 'DesignFlow Studio',
                tagline: 'Collaborative UI/UX design tool built for remote teams',
                description:
                    'Real-time collaborative design tool with advanced prototyping, component libraries, and seamless developer handoff.',
                websiteUrl: 'https://designflow.app',
                status: 'APPROVED',
            },
            {
                name: 'DataVault Security',
                tagline: 'Enterprise-grade encryption for sensitive data',
                description:
                    'Zero-knowledge encryption platform that keeps your data secure with military-grade cryptography and compliance monitoring.',
                websiteUrl: 'https://datavault.security',
                logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8e49e?w=400',
                status: 'APPROVED',
            },
            {
                name: 'AutoTest AI',
                tagline: 'AI-powered automated testing for modern applications',
                description:
                    'Generate comprehensive test suites automatically using machine learning to understand your code and user workflows.',
                websiteUrl: 'https://autotest.ai',
                status: 'PENDING',
            },
            {
                name: 'MetricsHub',
                tagline: 'All your business metrics in one intelligent dashboard',
                description:
                    'Aggregate KPIs from every tool in your stack. Real-time insights with customizable dashboards and AI-powered anomaly detection.',
                websiteUrl: 'https://metricshub.io',
                logoUrl: 'https://images.unsplash.com/photo-1551288050-bebda4e38f71?w=400',
                status: 'APPROVED',
            },
            {
                name: 'APIGuardian Pro',
                tagline: 'API security and monitoring for developers',
                description:
                    'Protect your APIs with advanced threat detection, rate limiting, and real-time monitoring of suspicious activities.',
                websiteUrl: 'https://apiguardian.dev',
                status: 'APPROVED',
            },
            {
                name: 'ContentNest',
                tagline: 'CMS that grows with your content strategy',
                description:
                    'Headless CMS with powerful content modeling, multi-channel publishing, and built-in SEO optimization.',
                websiteUrl: 'https://contentnest.app',
                logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
                status: 'PENDING',
            },
            {
                name: 'AnalyticsPro',
                tagline: 'Privacy-first analytics that respects user privacy',
                description:
                    'Cookie-less analytics platform that provides deep insights without compromising user privacy or violating regulations.',
                websiteUrl: 'https://analyticspro.io',
                status: 'APPROVED',
            },
            {
                name: 'DevNotify',
                tagline: 'Smart notifications for your development team',
                description:
                    "Intelligent alert system that learns your team's preferences and delivers critical notifications at the right time.",
                websiteUrl: 'https://devnotify.app',
                status: 'APPROVED',
            },
            {
                name: 'BackupVault',
                tagline: 'Automated disaster recovery for your entire infrastructure',
                description:
                    'One-click deployment recovery across multiple cloud providers with point-in-time restore capabilities.',
                websiteUrl: 'https://backupvault.io',
                logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8e49e?w=400',
                status: 'PENDING',
            },
            {
                name: 'CodeReview AI',
                tagline: 'AI-powered code review that catches bugs before production',
                description:
                    'Intelligent code review assistant that understands best practices and provides actionable feedback on every pull request.',
                websiteUrl: 'https://codereview.ai',
                status: 'APPROVED',
            },
            {
                name: 'PerformanceBoost',
                tagline: 'Web performance optimization without code changes',
                description:
                    'Automatic image optimization, code splitting, and caching strategies that improve your site speed by up to 60%.',
                websiteUrl: 'https://performanceboost.dev',
                status: 'APPROVED',
            },
            {
                name: 'SecureChat Pro',
                tagline: 'End-to-end encrypted team communication',
                description:
                    'Enterprise messaging platform with zero-knowledge encryption, message search, and seamless integrations.',
                websiteUrl: 'https://securechat.pro',
                logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=400',
                status: 'PENDING',
            },
            {
                name: 'DatabaseOptimizer',
                tagline: 'Automatically optimize your database performance',
                description:
                    'ML-powered tool that analyzes query patterns and automatically creates indexes, rewrites slow queries, and manages schemas.',
                websiteUrl: 'https://dboptimizer.io',
                status: 'APPROVED',
            },
            {
                name: 'LocalizationHub',
                tagline: 'Translate and localize apps for 150+ languages',
                description:
                    'Platform for managing translations with AI-assisted suggestions, glossaries, and context-aware localization.',
                websiteUrl: 'https://localizationhub.app',
                status: 'PENDING',
            },
            {
                name: 'APIDebugger',
                tagline: 'Visual API debugging and testing tool',
                description:
                    'Interactive tool for testing APIs with request/response visualization, automated testing, and mock server capabilities.',
                websiteUrl: 'https://apidebugger.dev',
                logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
                status: 'APPROVED',
            },
            {
                name: 'DataPipeline AI',
                tagline: 'Build ETL pipelines without coding',
                description:
                    'Visual data pipeline builder with 500+ connectors, data transformation rules, and automated scheduling.',
                websiteUrl: 'https://datapipeline.ai',
                status: 'APPROVED',
            },
            {
                name: 'MonitorPulse',
                tagline: 'Real-time infrastructure monitoring and alerting',
                description:
                    'Unified monitoring platform for servers, databases, applications with predictive alerting and automated remediation.',
                websiteUrl: 'https://monitorpulse.io',
                status: 'PENDING',
            },
            {
                name: 'DevDocumentation',
                tagline: 'Beautiful API documentation that developers love',
                description:
                    'Auto-generate interactive API docs with examples, SDKs, and tutorials from your API specifications.',
                websiteUrl: 'https://devdocs.ai',
                logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=400',
                status: 'APPROVED',
            },
        ],
    });
    console.log('✅ Created sample products');
}

export { seedProducts };
