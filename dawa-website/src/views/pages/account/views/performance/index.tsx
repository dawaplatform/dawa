'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Eye,
  MessageSquare,
  Phone,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    date: 'Nov 25',
    impressions: 0.3,
    visitors: 0.4,
    phoneView: 0.2,
    chatRequests: 0.1,
  },
  {
    date: 'Nov 26',
    impressions: 0.5,
    visitors: 0.6,
    phoneView: 0.3,
    chatRequests: 0.2,
  },
  {
    date: 'Nov 27',
    impressions: 0.4,
    visitors: 0.5,
    phoneView: 0.4,
    chatRequests: 0.3,
  },
  {
    date: 'Nov 28',
    impressions: 0.6,
    visitors: 0.7,
    phoneView: 0.5,
    chatRequests: 0.4,
  },
  {
    date: 'Nov 29',
    impressions: 0.7,
    visitors: 0.8,
    phoneView: 0.6,
    chatRequests: 0.5,
  },
  {
    date: 'Nov 30',
    impressions: 0.8,
    visitors: 0.9,
    phoneView: 0.7,
    chatRequests: 0.6,
  },
  {
    date: 'Dec 1',
    impressions: 0.9,
    visitors: 1.0,
    phoneView: 0.8,
    chatRequests: 0.7,
  },
  {
    date: 'Dec 2',
    impressions: 0.8,
    visitors: 0.9,
    phoneView: 0.7,
    chatRequests: 0.6,
  },
  {
    date: 'Dec 3',
    impressions: 0.7,
    visitors: 0.8,
    phoneView: 0.6,
    chatRequests: 0.5,
  },
  {
    date: 'Dec 4',
    impressions: 0.6,
    visitors: 0.7,
    phoneView: 0.5,
    chatRequests: 0.4,
  },
  {
    date: 'Dec 5',
    impressions: 0.5,
    visitors: 0.6,
    phoneView: 0.4,
    chatRequests: 0.3,
  },
  {
    date: 'Dec 6',
    impressions: 0.4,
    visitors: 0.5,
    phoneView: 0.3,
    chatRequests: 0.2,
  },
  {
    date: 'Dec 7',
    impressions: 0.3,
    visitors: 0.4,
    phoneView: 0.2,
    chatRequests: 0.1,
  },
  {
    date: 'Dec 8',
    impressions: 0.2,
    visitors: 0.3,
    phoneView: 0.1,
    chatRequests: 0.0,
  },
  {
    date: 'Dec 9',
    impressions: 0.1,
    visitors: 0.2,
    phoneView: 0.0,
    chatRequests: 0.0,
  },
];

const metrics = [
  {
    title: 'Impressions',
    value: '1.2K',
    change: '+12.3%',
    icon: Eye,
    color: 'black',
  },
  {
    title: 'Visitors',
    value: '854',
    change: '+8.2%',
    icon: TrendingUp,
    color: '#22c55e',
  },
  {
    title: 'Phone Views',
    value: '432',
    change: '+5.7%',
    icon: Phone,
    color: '#f97316',
  },
  {
    title: 'Chat Requests',
    value: '128',
    change: '+3.4%',
    icon: MessageSquare,
    color: '#ef4444',
  },
];

export default function PerformancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Performance</h2>
          <p className="text-gray-600">
            Track your platform metrics and analytics
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal h-10',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon
                className="h-4 w-4"
                style={{ color: metric.color }}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-500">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="black"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="phoneView"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="chatRequests"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
