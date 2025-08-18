import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { Card, Flex, Text, Box, Badge, Stack, Grid } from '@sanity/ui';
import { 
  BsCalendarEvent, 
  BsPeople, 
  BsCalendarCheck, 
  BsCalendarX,
  BsCurrencyDollar,
  BsGraphUp
} from 'react-icons/bs';

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  averageAttendeesPerEvent: number;
  eventsThisMonth: number;
}

export default function Dashboard() {
  const client = useClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all occurrences
        const occurrences = await client.fetch(`
          *[_type == "occurrence"] {
            _id,
            title,
            startDate,
            endDate,
            active,
            attendants,
            basicPrice,
            currency
          }
        `);

        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats: DashboardStats = {
          totalEvents: occurrences.length,
          activeEvents: occurrences.filter((event: any) => event.active).length,
          upcomingEvents: occurrences.filter((event: any) => 
            event.startDate && new Date(event.startDate) > now
          ).length,
          pastEvents: occurrences.filter((event: any) => 
            event.endDate && new Date(event.endDate) < now
          ).length,
          totalAttendees: occurrences.reduce((sum: number, event: any) => 
            sum + (event.attendants?.length || 0), 0
          ),
          totalRevenue: occurrences.reduce((sum: number, event: any) => {
            const attendees = event.attendants?.length || 0;
            const price = event.basicPrice || 0;
            return sum + (attendees * price);
          }, 0),
          averageAttendeesPerEvent: occurrences.length > 0 
            ? Math.round(occurrences.reduce((sum: number, event: any) => 
                sum + (event.attendants?.length || 0), 0) / occurrences.length)
            : 0,
          eventsThisMonth: occurrences.filter((event: any) => 
            event.startDate && new Date(event.startDate) >= thisMonth
          ).length
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [client]);

  if (loading) {
    return (
      <Box padding={4}>
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box padding={4}>
        <Text>Error loading dashboard data</Text>
      </Box>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    tone = 'primary',
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    tone?: 'primary' | 'positive' | 'caution' | 'critical';
    subtitle?: string;
  }) => (
    <Card 
      padding={4} 
      radius={2} 
      shadow={1} 
      tone={tone}
      style={{ 
        transition: 'all 0.2s ease-in-out',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Box style={{ opacity: 0.8 }}>
            <Icon size={20} />
          </Box>
          <Text size={3} weight="bold">
            {value}
          </Text>
        </Flex>
        <Text size={1} muted style={{ textAlign: 'center', fontWeight: '500' }}>
          {title}
        </Text>
        {subtitle && (
          <Text size={0} muted style={{ textAlign: 'center' }}>
            {subtitle}
          </Text>
        )}
      </Stack>
    </Card>
  );

  return (
    <Box padding={4}>
      <Text size={4} weight="bold" style={{ marginBottom: '1rem' }}>
        Dashboard Overview
      </Text>
      
      <Grid columns={[1, 2, 4]} gap={3}>
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={BsCalendarEvent}
          tone="primary"
        />
        
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          icon={BsCalendarCheck}
          tone="positive"
        />
        
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={BsCalendarEvent}
          tone="caution"
        />
        
        <StatCard
          title="Past Events"
          value={stats.pastEvents}
          icon={BsCalendarX}
          tone="critical"
        />
        
        <StatCard
          title="Total Attendees"
          value={stats.totalAttendees}
          icon={BsPeople}
          tone="primary"
        />
        
        <StatCard
          title="Total Revenue"
          value={`€${stats.totalRevenue.toLocaleString()}`}
          icon={BsCurrencyDollar}
          tone="positive"
        />
        
        <StatCard
          title="Avg Attendees/Event"
          value={stats.averageAttendeesPerEvent}
          icon={BsGraphUp}
          tone="primary"
        />
        
        <StatCard
          title="Events This Month"
          value={stats.eventsThisMonth}
          icon={BsCalendarEvent}
          tone="caution"
        />
      </Grid>

      <Box style={{ marginTop: '2rem' }}>
        <Card padding={4} radius={2} shadow={1}>
          <Text size={2} weight="semibold" style={{ marginBottom: '1rem' }}>
            Quick Actions
          </Text>
          <Flex gap={3} wrap="wrap">
            <Card 
              padding={3} 
              radius={2} 
              tone="primary" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minWidth: '160px'
              }}
            >
              <Flex align="center" gap={2}>
                <BsCalendarEvent size={16} />
                <Text size={1} weight="semibold">Create New Event</Text>
              </Flex>
            </Card>
            <Card 
              padding={3} 
              radius={2} 
              tone="caution" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minWidth: '160px'
              }}
            >
              <Flex align="center" gap={2}>
                <BsCalendarCheck size={16} />
                <Text size={1} weight="semibold">View All Events</Text>
              </Flex>
            </Card>
            <Card 
              padding={3} 
              radius={2} 
              tone="positive" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minWidth: '160px'
              }}
            >
              <Flex align="center" gap={2}>
                <BsGraphUp size={16} />
                <Text size={1} weight="semibold">Export Data</Text>
              </Flex>
            </Card>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
