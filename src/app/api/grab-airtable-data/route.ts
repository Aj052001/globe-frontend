// src/app/api/grab-airtable-data/route.ts

import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const airtableConfig = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableName: 'Residents' // Your table name
};

// Initialize Airtable
const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseId!);

export async function GET() {
  try {
    const records = await base(airtableConfig.tableName).select().all();
    
    const dashboardData = {
      metrics: {
        applications: { total: 0, data: [] as any[] },
        funding: { total: 0, data: [] as any[] },
        github: { total: 0, data: [] as any[] },
        revenue: { total: 0, data: [] as any[] }
      },
      social: {
        viral: [] as any[],
        recent: [] as any[]
      }
    };

    // Process records
    records.forEach(record => {
      const name = record.get('Name') as string;
      
      // Process Applications
      if (record.get('Applications')) {
        const applications = record.get('Applications') as number;
        dashboardData.metrics.applications.data.push({
          name,
          value: applications.toString(),
          status: record.get('Status') as string
        });
        dashboardData.metrics.applications.total += applications;
      }

      // Process Funding
      if (record.get('FundingAmount')) {
        const funding = record.get('FundingAmount') as string;
        dashboardData.metrics.funding.data.push({
          name,
          value: funding,
          status: record.get('FundingStage') as string
        });
        const amount = parseFloat(funding.replace(/[$M]/g, ''));
        dashboardData.metrics.funding.total += amount;
      }

      // Process GitHub
      if (record.get('GitHubPushes')) {
        const pushes = record.get('GitHubPushes') as number;
        const repos = record.get('Repositories') as number || 0;
        dashboardData.metrics.github.data.push({
          name,
          value: `${pushes} pushes`,
          status: `${repos} repos`
        });
        dashboardData.metrics.github.total += pushes;
      }

      // Process Revenue
      if (record.get('Revenue')) {
        const revenue = record.get('Revenue') as string;
        const growth = record.get('RevenueGrowth') as string || '+0%';
        dashboardData.metrics.revenue.data.push({
          name,
          value: revenue,
          status: growth
        });
        const amount = parseFloat(revenue.replace(/[$K]/g, ''));
        dashboardData.metrics.revenue.total += amount;
      }

      // Process Social
      const tweetType = record.get('TweetType') as string;
      if (record.get('TweetContent') && tweetType) {
        const tweet = {
          author: name,
          handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
          content: record.get('TweetContent') as string,
          engagement: record.get('Engagement') as string || '0 likes • 0 retweets',
          time: record.get('TweetTime') as string || 'recently'
        };

        if (tweetType === 'viral') {
          dashboardData.social.viral.push(tweet);
        } else if (tweetType === 'recent') {
          dashboardData.social.recent.push(tweet);
        }
      }
    });

    // Format totals
    dashboardData.metrics.funding.total = `$${dashboardData.metrics.funding.total}M`;
    dashboardData.metrics.revenue.total = `$${dashboardData.metrics.revenue.total}K`;
    dashboardData.metrics.github.total = dashboardData.metrics.github.total.toString();

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
}