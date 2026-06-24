"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scale, Shield, FileText, Key, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

export default function LegalPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Legal</h1><p className="text-muted-foreground">Protect your music and understand your rights</p></div>
        <Tabs defaultValue="copyright" className="space-y-4">
          <TabsList>
            <TabsTrigger value="copyright" className="gap-2"><Shield className="h-4 w-4" />Copyrights</TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2"><FileText className="h-4 w-4" />Licenses</TabsTrigger>
            <TabsTrigger value="codes" className="gap-2"><Key className="h-4 w-4" />Rights Codes</TabsTrigger>
          </TabsList>
          <TabsContent value="copyright" className="space-y-4">
            <Card><CardContent className="p-4"><p className="font-medium mb-2">Two Copyrights in Every Song</p><div className="grid grid-cols-2 gap-4 text-sm"><div className="p-3 border rounded-lg"><p className="font-medium text-blue-500">Composition</p><p className="text-muted-foreground">The song itself — lyrics, melody, arrangement. Owned by songwriter/publisher.</p></div><div className="p-3 border rounded-lg"><p className="font-medium text-green-500">Sound Recording</p><p className="text-muted-foreground">The recorded performance. Owned by recording artist/label.</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4 space-y-2 text-sm"><p className="font-medium">Duration: Life + 70 years (or 95 years for work-for-hire)</p><p className="text-muted-foreground">Registration: $35-45 at copyright.gov — enables lawsuits and statutory damages</p><p className="text-muted-foreground">Termination: Reclaim after 35 years (except work-for-hire)</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="licenses" className="space-y-4">
            {[
              { name: "Mechanical License", desc: "Reproduce and distribute a composition. $0.091/copy statutory rate. Compulsory after first release.", color: "text-blue-500" },
              { name: "Performance License", desc: "Public performance via PROs (ASCAP/BMI). Blanket licenses. 50/50 writer/publisher split.", color: "text-green-500" },
              { name: "Synchronization License", desc: "Pair composition with visual media. Fully negotiable. Need BOTH sync + master-use.", color: "text-purple-500" },
              { name: "Master-Use License", desc: "Use copyrighted recording in new project. From master owner (usually label).", color: "text-orange-500" },
            ].map(lic => (
              <Card key={lic.name}><CardContent className="p-4"><div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full bg-current ${lic.color}`} /><div><p className="font-medium">{lic.name}</p><p className="text-sm text-muted-foreground">{lic.desc}</p></div></div></CardContent></Card>
            ))}
          </TabsContent>
          <TabsContent value="codes" className="space-y-4">
            {[
              { code: "ISRC", name: "International Standard Recording Code", desc: "12-digit code per sound recording. Format: Country(2)+Registrant(3)+Year(2)+Designation(5). Same recording = same ISRC forever.", color: "text-blue-500" },
              { code: "ISWC", name: "International Standard Musical Work Code", desc: "10-digit code per composition. Starts with T. Assigned by ASCAP (US). Multiple recordings share one ISWC.", color: "text-green-500" },
              { code: "IPI", name: "Interested Party Information", desc: "Unique identifier for songwriters/publishers. Like SSN for music. Assigned by PRO. Use same across all platforms.", color: "text-purple-500" },
            ].map(code => (
              <Card key={code.code}><CardContent className="p-4"><div className="flex items-start gap-3"><div className={`p-2 bg-muted rounded-lg`}><Key className={`h-5 w-5 ${code.color}`} /></div><div><p className="font-medium">{code.code} — {code.name}</p><p className="text-sm text-muted-foreground">{code.desc}</p></div></div></CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
