'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, TrendingUp, UserPlus, Users } from 'lucide-react';

/**
 * StatsCard Component
 * Reusable component for displaying statistics.
 */
function StatsCard({
  title,
  icon: Icon,
  value,
  subtitle,
}: React.PropsWithChildren<any>) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary_1" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

/**
 * FollowerItem Component
 * Reusable component for displaying individual follower entries.
 */
function FollowerItem({
  name,
  since,
  avatarSrc,
}: React.PropsWithChildren<any>) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={`${name}'s avatar`} />
          <AvatarFallback>
            {name
              .split(' ')
              .map((n: any) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Member since {since}</p>
        </div>
      </div>
      <Button variant="outline" className="h-10">
        Following
      </Button>
    </div>
  );
}

export default function FollowersPage() {
  // Sample data for followers
  const [followers, setFollowers] = useState([
    {
      id: 1,
      name: 'Gideon Chicken',
      since: '2023',
      avatarSrc: '/placeholder.svg',
    },
    {
      id: 2,
      name: 'Jane Doe',
      since: '2022',
      avatarSrc: '/placeholder.svg',
    },
    // Add more followers here
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered followers based on search term
  const filteredFollowers = followers.filter((follower) =>
    follower.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">My Followers</h2>
          <p className="text-gray-600">
            Manage your followers and grow your network
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-10">
            Following
          </Button>
          <Button className="bg-primary_1 hover:bg-primary_1/90 h-10 text-white">
            My Followers
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        <StatsCard
          title="Total Followers"
          icon={Users}
          value="1,234"
          subtitle="+7% from last week"
        />
        <StatsCard
          title="New Followers"
          icon={UserPlus}
          value="56"
          subtitle="This week"
        />
        <StatsCard
          title="Engagement Rate"
          icon={TrendingUp}
          value="4.6%"
          subtitle="+0.8% from last month"
        />
      </div>

      {/* Follower List */}
      <Card>
        <CardHeader>
          <CardTitle>Follower List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <Input
              placeholder="Search followers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs h-10"
            />

            {/* Follower Items */}
            <div className="space-y-4">
              {filteredFollowers.length > 0 ? (
                filteredFollowers.map((follower) => (
                  <FollowerItem
                    key={follower.id}
                    name={follower.name}
                    since={follower.since}
                    avatarSrc={follower.avatarSrc}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No followers found.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Friends */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4">
            <Send className="h-6 w-6 text-primary_1" aria-hidden="true" />
            <p className="text-sm font-medium">
              Invite your friends to follow you
            </p>
          </div>
          <Button className="h-10 bg-primary_1 hover:bg-primary_1/90 text-white">
            Invite Friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
