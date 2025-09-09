'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Star, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">Feedback</h2>
          <p className="text-gray-600">
            Manage and respond to customer feedback
          </p>
        </div>
        <Tabs defaultValue="received" className="w-full md:w-1/3">
          <TabsList className="grid grid-cols-2 gap-2 h-auto">
            <TabsTrigger value="received" className="h-10">
              Received (3)
            </TabsTrigger>
            <TabsTrigger value="sent" className="h-10">
              Sent (1)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {/* Total Feedback */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-primary_1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500">3 received, 1 sent</p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-5 w-5 text-primary_1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-gray-500">Out of 5 stars</p>
          </CardContent>
        </Card>

        {/* Response Rate */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary_1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-gray-500">All feedback responded to</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Example feedback */}
            <FeedbackItem
              title="Great service!"
              from="John Doe"
              message="The product was durable. Thank you!"
            />
          </div>
        </CardContent>
      </Card>

      {/* Share Feedback Link */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-6 w-6 text-primary_1" />
            <p className="text-sm font-medium">
              Share your feedback link with customers
            </p>
          </div>
          <Button className="h-10 bg-primary_1 hover:bg-primary_1/90">
            Copy Feedback Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * FeedbackItem Component
 * Reusable component for displaying individual feedback entries.
 */
function FeedbackItem({
  title,
  from,
  message,
}: {
  title: string;
  from: string;
  message: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">From: {from}</p>
        <p className="text-sm mt-2 text-gray-700">{message}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" size="sm" className="h-10">
          Reply
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-10 text-green-500 hover:text-green-600"
        >
          Mark as Resolved
        </Button>
      </div>
    </div>
  );
}
