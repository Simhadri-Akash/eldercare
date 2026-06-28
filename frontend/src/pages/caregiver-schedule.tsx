import { useState } from "react";   
import { Link, useLocation } from "wouter";
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Plus,
  Activity,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const TODAY_VISITS = [
  {
    id: 1,
    client: "Dorothy Simmons",
    time: "9:00 AM",
    type: "Routine Visit",
    status: "Completed",
  },

  {
    id: 2,
    client: "Walter Nguyen",
    time: "1:00 PM",
    type: "Follow-up",
    status: "Next",
  },

  {
    id: 3,
    client: "Margaret Chen",
    time: "3:00 PM",
    type: "Routine Visit",
    status: "Pending",
  },
];

const WEEKLY_SCHEDULE = [
  { day: "Mon", visits: 3 },
  { day: "Tue", visits: 5 },
  { day: "Wed", visits: 2 },
  { day: "Thu", visits: 4 },
  { day: "Fri", visits: 3 },
  { day: "Sat", visits: 1 },
  { day: "Sun", visits: 0 },
];
export default function CaregiverSchedule() {
const [location] = useLocation();
  return (
    <div className="h-screen flex bg-muted/30 overflow-hidden">
        <aside className="w-72 bg-white border-r shadow-sm flex flex-col h-screen sticky top-0">

        {/* Profile */}

        <div className="p-6 border-b">

            <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary">
                SM
            </div>
            </div>

            <div className="text-center mt-4">

            <h2 className="font-bold text-xl">
                Sarah Mitchell
            </h2>

            <p className="text-muted-foreground">
                Senior Care Manager
            </p>

            </div>

        </div>

        {/* Navigation */}

        <nav className="space-y-2 p-4 flex-1">

            <Link href="/caregiver-dashboard">
                <Button
                variant="ghost"
                className="w-full justify-start"
                >
                <Activity className="w-4 h-4 mr-3" />
                Dashboard
                </Button>
            </Link>

            <Link href="/caregiver-clients">
                <Button
                variant="ghost"
                className="w-full justify-start"
                >
                <Users className="w-4 h-4 mr-3" />
                My Clients
                </Button>
            </Link>

            <Link href="/caregiver-schedule">
                <Button
                variant="secondary"
                className="w-full justify-start"
                >
                <Calendar className="w-4 h-4 mr-3" />
                Schedule
                </Button>
            </Link>

            <Link href="/messages">
                <Button
                variant="ghost"
                className="w-full justify-start"
                >
                <MessageSquare className="w-4 h-4 mr-3" />
                Messages
                </Button>
            </Link>

            <Link href="/health-reports">
                <Button
                variant="ghost"
                className="w-full justify-start"
                >
                <FileText className="w-4 h-4 mr-3" />
                Reports
                </Button>
            </Link>

        </nav>

        <div className="mt-auto p-4 border-t bg-muted/20">

            <Link href="/">
                <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600"
                >
                Logout
                </Button>
            </Link>
        </div>
        </aside>
        <main className="flex-1 p-6 space-y-6 overflow-y-auto h-screen">
        <div className="flex justify-between items-center">

            <div>
                <div>

                    <h1 className="text-4xl font-bold">
                        Schedule
                    </h1>

                    <p className="text-muted-foreground mt-1">
                        Daily caregiver operations and visit planning
                    </p>

                </div>

                <p className="text-muted-foreground">
                Manage visits and appointments
                </p>
            </div>

            <div className="flex gap-3">

                <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Visit
                </Button>

                <Button variant="outline">
                Export Schedule
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <Card>
                <CardContent className="p-5">
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Today's Visits
                    </p>
                    <h2 className="text-3xl font-bold">
                        5
                    </h2>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Completed
                    </p>
                    <h2 className="text-3xl font-bold text-green-600">
                        3
                    </h2>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5">
                <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Upcoming
                    </p>
                    <h2 className="text-3xl font-bold text-blue-600">
                        2
                    </h2>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-5">
                <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-orange-500" />
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Distance
                    </p>
                    <h2 className="text-3xl font-bold">
                        18km
                    </h2>
                    </div>
                </div>
                </CardContent>
            </Card>

        </div>
        <div className="grid lg:grid-cols-3 gap-6">

            {/* Timeline */}

            <Card className="lg:col-span-2">

                <CardHeader>
                <CardTitle>
                    Today's Schedule
                </CardTitle>
                <p className="text-muted-foreground">
                Tuesday, June 23, 2026
                </p>
                </CardHeader>

                <CardContent>

                    <div className="space-y-4">

                        {TODAY_VISITS.map((visit) => (

                        <div
                            key={visit.id}
                            className="flex items-center justify-between border rounded-xl p-6 hover:bg-muted/50 transition"
                        >

                            <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                {visit.client}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                {visit.type}
                                </p>
                                <p className="text-sm font-medium text-primary">
                                {visit.time}
                                </p>
                            </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {visit.status === "Completed" && (
                                    <Badge className="bg-green-100 text-green-700 border-green-300">
                                    Completed
                                    </Badge>
                                )}
                                {visit.status === "Next" && (
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                    Next Visit
                                    </Badge>
                                )}
                                {visit.status === "Pending" && (
                                    <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                                    Pending
                                    </Badge>
                                )}
                                <Button size="sm">
                                    Open
                                </Button>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-6">

                <Card>

                    <CardHeader>
                        <CardTitle>
                        Today's Summary
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-bold text-green-600">
                            3
                        </span>
                        </div>

                        <div className="flex justify-between">
                        <span>Remaining</span>
                        <span className="font-bold text-blue-600">
                            2
                        </span>
                        </div>

                        <div className="flex justify-between">
                        <span>Critical Clients</span>
                        <span className="font-bold text-red-600">
                            1
                        </span>
                        </div>

                    </CardContent>

                </Card>

                <Card>

                    <CardHeader>
                        <CardTitle>
                        Alerts
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="flex gap-3">

                            <AlertTriangle className="text-red-500" />
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex-1">
                                <p className="font-medium">
                                Walter Nguyen
                                </p>
                                <p className="text-sm text-muted-foreground">
                                Requires follow-up review today.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
         </div>
         <Card>
            <CardHeader>
                <CardTitle>
                Weekly Schedule Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-3">
                {WEEKLY_SCHEDULE.map((day) => (
                    <div
                    key={day.day}
                    className="border rounded-xl p-4 text-center hover:bg-muted/50 transition"
                    >
                    <p className="font-semibold">
                        {day.day}
                    </p>
                    <p className="text-3xl font-bold mt-2">
                        {day.visits}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Visits
                    </p>
                    </div>
                ))}

                </div>

            </CardContent>
        </Card>
        <Card>

            <CardHeader>
                <CardTitle>
                Upcoming Visits
                </CardTitle>
            </CardHeader>

            <CardContent>

                <div className="overflow-hidden">

                <table className="w-full">

                    <thead>

                    <tr className="border-b">

                        <th className="text-left py-3">
                        Client
                        </th>

                        <th className="text-left py-3">
                        Time
                        </th>

                        <th className="text-left py-3">
                        Type
                        </th>

                        <th className="text-left py-3">
                        Status
                        </th>

                        <th className="text-right py-3">
                        Action
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {TODAY_VISITS.map((visit) => (

                        <tr
                        key={visit.id}
                        className="border-b hover:bg-muted/30"
                        >

                        <td className="py-4">
                            {visit.client}
                        </td>

                        <td>
                            {visit.time}
                        </td>

                        <td>
                            {visit.type}
                        </td>

                        <td>

                            <Badge>
                            {visit.status}
                            </Badge>

                        </td>

                        <td className="text-right">

                            <Button
                            variant="outline"
                            size="sm"
                            >
                            View
                            </Button>

                        </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

                </div>

            </CardContent>
        </Card>
        <Card>

            <CardHeader>
                <CardTitle>
                Quick Actions
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-3">

                <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Visit
                </Button>

                <Button variant="outline">
                Start Visit
                </Button>

                <Button variant="outline">
                Log Visit
                </Button>

                <Button variant="outline">
                Request Supervisor
                </Button>

            </CardContent>
         </Card>
     </main>
    </div>
    
  );
}