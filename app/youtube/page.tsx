"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Globe,
  Music,
  Shield,
  FileText,
  Target,
  Users,
  BarChart3
} from "lucide-react"

interface YouTubeFAQ {
  question: string
  answer: string
}

const faqs: YouTubeFAQ[] = [
  {
    question: "How much does YouTube pay per view?",
    answer: "Roughly $1 per 1,000 views as a general estimate. Rates vary by region, ad demand, subscriber count, and whether the viewer is on free or premium tier. This is a moving target based on advertising and subscribers."
  },
  {
    question: "Do I need a sync license for YouTube?",
    answer: "Technically yes — any video using someone else's composition needs a sync license from the publisher. However, YouTube's agreements with PROs and Content ID make this mostly automatic. Rights holders can claim and monetize instead of blocking."
  },
  {
    question: "What's the difference between Content ID and a copyright strike?",
    answer: "Content ID claims are automated matches — the rights holder can monetize, track, or block. A takedown (strike) is a legal DMCA action. 3 strikes = channel banned. Claims are much more common and less severe."
  },
  {
    question: "What's a CMS vs Content ID?",
    answer: "CMS (Content Management System) is the full platform for rights holders. Content ID is one module within CMS that auto-matches videos. CMS also includes Video Manager, Channel Manager, AdSense, and Analytics."
  },
  {
    question: "How do I get YouTube CMS access?",
    answer: "Apply via an aggregator (CD Baby, DistroKid, Exploration, etc.) or directly to YouTube. Must complete audience growth and advance digital rights certifications. YouTube has periodically paused new applications."
  },
  {
    question: "What are the 4 Content ID policies?",
    answer: "Monetize (ads placed, you earn revenue), Track (no ads, but you see analytics), Block (video not viewable), Takedown (legal strike, 3 = channel banned). Most restrictive policy wins when multiple owners claim."
  },
  {
    question: "Does YouTube pay PRO performance royalties?",
    answer: "Yes — YouTube has blanket performance licenses with ASCAP, BMI, SESAC, and GMR. These are paid separately from sync/content ID revenue. The PROs pay songwriters and publishers their share."
  },
  {
    question: "How do covers work on YouTube?",
    answer: "A cover uses only the composition (not the original recording). The composition owner/publisher can claim via Content ID. No master-use license needed since you're recording your own version. You still need a sync license from the publisher."
  },
  {
    question: "What about live performances on YouTube?",
    answer: "Fan-uploaded live footage can be claimed by composition AND sound recording owners. If you own both (indie artist), you can claim and monetize. If only composition, the publisher claims."
  },
  {
    question: "How does YouTube pay vs other platforms?",
    answer: "YouTube pays via ad revenue share (you get a portion of ads shown on/around your content). Spotify/Apple pay per stream. YouTube rates fluctuate more due to ad market dynamics. YouTube is also the world's largest music consumption platform."
  },
]

export default function YouTubeGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">YouTube Guide</h1>
          <p className="text-muted-foreground">Complete guide to YouTube for musicians — Content ID, CMS, monetization, and more</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Video className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="contentid" className="gap-2">
              <Target className="h-4 w-4" />
              Content ID
            </TabsTrigger>
            <TabsTrigger value="monetize" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Monetization
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-2">
              <FileText className="h-4 w-4" />
              FAQs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>YouTube by the Numbers</CardTitle>
                  <CardDescription>From the Exploration.io YouTube Guide</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold">$3B+</p>
                    <p className="text-xs text-muted-foreground">Paid to rights holders</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold">#1</p>
                    <p className="text-xs text-muted-foreground">Music consumption platform</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold">720K+</p>
                    <p className="text-xs text-muted-foreground">Hours uploaded daily</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold">$1/1K</p>
                    <p className="text-xs text-muted-foreground">Rough CPM estimate</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Three Copyrights on YouTube
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="p-2 border rounded">
                      <p className="font-medium">Composition</p>
                      <p className="text-muted-foreground">The song (lyrics + melody). Owned by songwriter/publisher. Generates performance + sync royalties.</p>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="font-medium">Sound Recording</p>
                      <p className="text-muted-foreground">The actual recording. Owned by label/artist. Generates master royalties via Content ID.</p>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="font-medium">Music Video</p>
                      <p className="text-muted-foreground">Visual synced to audio. Usually owned by same label as sound recording.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      US vs International
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="p-2 border rounded">
                      <p className="font-medium">United States</p>
                      <p className="text-muted-foreground">Performance royalty paid to PROs separately. Sync/content ID paid direct to publisher. Two separate revenue streams.</p>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="font-medium">International</p>
                      <p className="text-muted-foreground">Performance + sync bundled together. Paid via local PRO to sub-publisher. One combined revenue stream.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contentid">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How Content ID Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium">Matching Methods</h4>
                      <div className="p-2 border rounded">
                        <p className="font-medium">Audio/Video Matching</p>
                        <p className="text-muted-foreground">Algorithm compares all uploaded videos against reference files. Automatic match triggers claim.</p>
                      </div>
                      <div className="p-2 border rounded">
                        <p className="font-medium">Potential Claims</p>
                        <p className="text-muted-foreground">High likelihood matches presented in queue for manual review.</p>
                      </div>
                      <div className="p-2 border rounded">
                        <p className="font-medium">Manual Claims</p>
                        <p className="text-muted-foreground">Search for videos manually and claim ownership.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Use Policies (Least to Most Restrictive)</h4>
                      <div className="p-2 border rounded border-green-500/30">
                        <p className="font-medium text-green-500">Monetize</p>
                        <p className="text-muted-foreground">Ads placed on video. You earn revenue from ad views.</p>
                      </div>
                      <div className="p-2 border rounded border-blue-500/30">
                        <p className="font-medium text-blue-500">Track</p>
                        <p className="text-muted-foreground">No ads, but you see viewing analytics.</p>
                      </div>
                      <div className="p-2 border rounded border-yellow-500/30">
                        <p className="font-medium text-yellow-500">Block</p>
                        <p className="text-muted-foreground">Video not viewable. "Don't use our stuff."</p>
                      </div>
                      <div className="p-2 border rounded border-red-500/30">
                        <p className="font-medium text-red-500">Takedown</p>
                        <p className="text-muted-foreground">Legal DMCA strike. 3 strikes = channel banned.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting CMS Access</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Apply via aggregator (CD Baby, DistroKid, Exploration) or directly to YouTube</p>
                  <p>• Must complete <strong>audience growth</strong> and <strong>advance digital rights</strong> certifications</p>
                  <p>• YouTube has periodically paused new CMS applications</p>
                  <p>• Need to upload reference files (audio fingerprints) for each sound recording</p>
                  <p>• Composition assets linked to sound recordings via ISRC codes</p>
                  <p className="text-muted-foreground">Threshold for YouTube Space access: 10,000 subscribers (LA), 5,000 (NYC), 2,500 (London)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monetize">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Streams on YouTube</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-green-500 mb-1">Ad Revenue (Content ID)</p>
                      <p className="text-muted-foreground">From videos using your music (user-generated content). You get a share of ad revenue. ~$1 per 1,000 views rough estimate.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-blue-500 mb-1">Channel Monetization</p>
                      <p className="text-muted-foreground">Revenue from ads on your own videos. Requires 1,000 subscribers + 4,000 watch hours.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-purple-500 mb-1">YouTube Premium</p>
                      <p className="text-muted-foreground">Share of subscription revenue based on watch time. Higher per-stream rate than ad-supported.</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-yellow-500 mb-1">Performance Royalties (via PROs)</p>
                      <p className="text-muted-foreground">Paid to songwriters/publishers through ASCAP/BMI. Separate from Content ID revenue.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>YouTube Monetization Requirements</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>1,000 subscribers</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>4,000 public watch hours in last 12 months</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AdSense account connected</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>2-step verification enabled</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No active Community Guidelines strikes</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Facebook/Instagram Monetization</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Facebook identifies copyrighted music in user posts and pays royalties to rights holders</p>
                  <p>• Payments differ between distributors, labels, and publishers</p>
                  <p>• CD Baby treats Facebook as a sync partner (audio in video content)</p>
                  <p>• Opt-in required through your distributor</p>
                  <p>• Separate from YouTube monetization</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faqs">
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
