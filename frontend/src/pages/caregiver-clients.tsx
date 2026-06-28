import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  UserCircle,
  CalendarDays,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react";

import { Link } from "wouter";
const CLIENTS = [
  {
    id: "1",
    name: "Margaret Chen",
    age: 74,
    status: "Stable",
    healthScore: 82,
    condition: "Hypertension",

    medications: [
      "Metformin 500mg",
      "Amlodipine 5mg",
      "Vitamin D"
    ],

    carePlan: [
      "Morning Walk",
      "Blood Pressure Check",
      "Medication Review"
    ],

    visits: [
      "June 23 - Routine Visit",
      "June 20 - Vitals Updated",
      "June 18 - Medication Review"
    ],

    notes:
      "Margaret is in good spirits. Completed exercises and requested more puzzles.",

    emergencyContact: {
      name: "James Chen",
      relation: "Son",
      phone: "+1 555-123-4567",
    },
  },

  {
    id: "2",
    name: "Walter Nguyen",
    age: 85,
    status: "Critical",
    healthScore: 45,
    condition: "Heart Disease",

    medications: [
      "Aspirin",
      "Atorvastatin"
    ],

    carePlan: [
      "Daily BP Monitoring",
      "Cardiology Follow-up"
    ],

    visits: [
      "June 22 - Emergency Review",
      "June 18 - Home Visit"
    ],

    notes:
      "Health score declining. Requires urgent GP review.",

    emergencyContact: {
      name: "Anna Nguyen",
      relation: "Daughter",
      phone: "+1 555-222-1111",
    },
  },
];
export default function CaregiverClients() {
    const [search, setSearch] = useState("");

    const [selectedClient, setSelectedClient] =
    useState(CLIENTS[0]);
      return (
        <div className="min-h-screen bg-muted/30 flex">
            <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">

                <div className="p-6 border-b">
                    <img
                    src="/befine-logo.jpeg"
                    alt="Befine"
                    className="h-10"
                    />
                </div>
                <div className="p-6 text-center border-b">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    SM
                    </div>

                    <h2 className="font-semibold">
                    Sarah Mitchell
                    </h2>

                    <p className="text-sm text-muted-foreground">
                    Senior Care Manager
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">

                    <Link href="/caregiver-dashboard">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <Activity className="w-5 h-5" />
                        Dashboard
                    </div>
                    </Link>

                    <Link href="/caregiver-clients">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary">
                        <UserCircle className="w-5 h-5" />
                        My Clients
                    </div>
                    </Link>

                    <Link href="/caregiver-schedule">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <CalendarDays className="w-5 h-5" />
                        Schedule
                    </div>
                    </Link>

                    <Link href="/caregiver-messages">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <MessageSquare className="w-5 h-5" />
                        Messages
                    </div>
                    </Link>

                    <Link href="/caregiver-reports">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <FileText className="w-5 h-5" />
                        Reports
                    </div>
                    </Link>

                </nav>

                <div className="p-4 border-t">

                    <Link href="/">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </div>
                    </Link>

                </div>

            </aside> 
            <main className="flex-1 p-6 overflow-y-auto"> 
                <div className="flex justify-between items-center mb-6">

                    <div>
                        <h1 className="text-3xl font-bold">
                        My Clients
                        </h1>

                        <p className="text-muted-foreground">
                        Manage assigned elderly clients
                        </p>
                    </div>

                </div> 
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-4 mb-6">

                    <Card>
                        <CardContent className="p-4">
                        <p>Total Clients</p>
                        <h2 className="text-3xl font-bold">
                            {CLIENTS.length}
                        </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                        <p>Stable</p>
                        <h2 className="text-3xl font-bold text-green-600">
                            {CLIENTS.filter(c => c.status === "Stable").length}
                        </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                        <p>Needs Attention</p>
                        <h2 className="text-3xl font-bold text-blue-600">
                            {CLIENTS.filter(
                            c => c.status === "Needs Attention"
                            ).length}
                        </h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                        <p>Critical</p>
                        <h2 className="text-3xl font-bold text-red-600">
                            {CLIENTS.filter(
                            c => c.status === "Critical"
                            ).length}
                        </h2>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Clients</CardTitle>
                        </CardHeader>

                        <CardContent>

                            <Input
                            placeholder="Search Client..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            />

                            <div className="mt-4 space-y-2">

                                {CLIENTS.filter(client =>
                                    client.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                ).map(client => (

                                    <div
                                    key={client.id}
                                    onClick={() =>
                                        setSelectedClient(client)
                                    }
                                    className={`p-4 border rounded-lg cursor-pointer transition-all
                                    ${
                                    selectedClient.id === client.id
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted"
                                    }`}
                                    >
                                    <h4 className="font-medium">
                                        {client.name}
                                    </h4>

                                    <p className="text-sm text-muted-foreground">
                                        Age {client.age}
                                    </p>

                                    <Badge
                                        className={
                                        client.status === "Stable"
                                        ? "bg-green-100 text-green-700"
                                        : client.status === "Critical"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-blue-100 text-blue-700"
                                        }
                                        >
                                        {client.status}
                                    </Badge>
                                    </div>

                                ))}

                            </div>

                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                {selectedClient.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex items-center justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">

                                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
                                        MC
                                        </div>

                                        <div>
                                        <h2 className="text-3xl font-bold">
                                            {selectedClient.name}
                                        </h2>

                                        <p className="text-muted-foreground">
                                            Age {selectedClient.age} • {selectedClient.condition}
                                        </p>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex gap-3">

                                <Button>
                                Log Visit
                                </Button>

                                <Button variant="outline">
                                Record Vitals
                                </Button>

                                <Button variant="outline">
                                Add Note
                                </Button>

                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                Last Visit Summary
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p>
                                Last Visit:
                                {selectedClient.visits[0]}
                                </p>

                                <p className="mt-2 text-muted-foreground">
                                Routine care completed.
                                No major issues reported.
                                </p>
                            </CardContent>
                        </Card>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                    Medications
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>

                                    {selectedClient.medications.map(
                                    (med) => (
                                        <p key={med}>• {med}</p>
                                    )
                                    )}

                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                    Care Plan
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>

                                    {selectedClient.carePlan.map(
                                    (item) => (
                                        <p key={item}>
                                        ✓ {item}
                                        </p>
                                    )
                                    )}

                                </CardContent>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                Visit History
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                {selectedClient.visits.map(
                                visit => (
                                    <p key={visit}>
                                    {visit}
                                    </p>
                                )
                                )}

                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                Clinical Notes
                                </CardTitle>
                            </CardHeader>

                            <CardContent>

                                <p>
                                {selectedClient.notes}
                                </p>

                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                Emergency Contact
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">

                                <p className="font-semibold">
                                    {selectedClient.emergencyContact.name}
                                </p>

                                <p>
                                    {selectedClient.emergencyContact.relation}
                                </p>

                                <p className="text-primary">
                                    {selectedClient.emergencyContact.phone}
                                </p>

                                <div className="flex gap-2">
                                    <Button>Call</Button>
                                    <Button variant="outline">
                                    Message
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    </div>
 );
}
