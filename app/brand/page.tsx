"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Palette, Upload, Trash2, Copy, Check, Image, Type, Edit, ShoppingBag, DollarSign, MapPin, Megaphone, Handshake, Star, TrendingUp, ExternalLink, Target } from "lucide-react"

interface BrandAsset { id: string; name: string; type: "logo" | "color" | "font" | "image"; value: string; isPrimary?: boolean }
interface MerchItem { id: string; name: string; category: string; price: number; cost: number; stock: number; status: string }
interface BrandDeal { id: string; brand: string; type: string; status: string; value?: number; deliverables: string[] }

const mockAssets: BrandAsset[] = [
  { id: "1", name: "Primary Logo", type: "logo", value: "https://placehold.co/200x200/7f5af0/ffffff?text=AP", isPrimary: true },
  { id: "2", name: "Primary Purple", type: "color", value: "#7f5af0", isPrimary: true },
  { id: "3", name: "Secondary Green", type: "color", value: "#2cb67d" },
  { id: "4", name: "Montserrat", type: "font", value: "Headings" },
]

const mockMerch: MerchItem[] = [
  { id: "1", name: "Vintage Logo Tee", category: "apparel", price: 35, cost: 12, stock: 150, status: "active" },
  { id: "2", name: "Limited Hoodie", category: "apparel", price: 65, cost: 25, stock: 0, status: "sold_out" },
  { id: "3", name: "Vinyl - Debut Album", category: "music", price: 28, cost: 8, stock: 200, status: "active" },
  { id: "4", name: "Enamel Pin Set", category: "accessory", price: 12, cost: 3, stock: 300, status: "active" },
]

const mockDeals: BrandDeal[] = [
  { id: "1", brand: "Fender Guitars", type: "endorsement", status: "active", value: 5000, deliverables: ["Social posts", "Use on tour", "Clinic appearance"] },
  { id: "2", brand: "Spotify", type: "partnership", status: "active", deliverables: ["Playlist features", "Social promotion"] },
]

export default function BrandPage() {
  const [assets, setAssets] = useState<BrandAsset[]>(mockAssets)
  const [newAsset, setNewAsset] = useState({ name: "", type: "logo", value: "" })
  const [showAdd, setShowAdd] = useState(false)

  const addAsset = () => {
    if (!newAsset.name) return
    setAssets(prev => [...prev, { ...newAsset, id: Date.now().toString(), type: newAsset.type as BrandAsset["type"] }])
    setNewAsset({ name: "", type: "logo", value: "" })
    setShowAdd(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand</h1>
            <p className="text-muted-foreground">Manage your brand assets, merch strategy, and partnerships</p>
          </div>
        </div>

        <Tabs defaultValue="assets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assets" className="gap-2"><Palette className="h-4 w-4" />Assets</TabsTrigger>
            <TabsTrigger value="merch" className="gap-2"><ShoppingBag className="h-4 w-4" />Merch</TabsTrigger>
            <TabsTrigger value="deals" className="gap-2"><Handshake className="h-4 w-4" />Partnerships</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" />Add Asset</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assets.map(a => (
                <Card key={a.id} className="hover:shadow-md">
                  <CardContent className="p-3">
                    {a.type === "color" ? (
                      <div className="h-16 rounded-lg mb-2" style={{ backgroundColor: a.value }} />
                    ) : (
                      <div className="h-16 rounded-lg bg-muted flex items-center justify-center mb-2"><Image className="h-6 w-6 text-muted-foreground" /></div>
                    )}
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.type === "color" ? a.value : a.type}</p>
                    {a.isPrimary && <Badge className="text-xs mt-1">Primary</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {showAdd && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Input placeholder="Asset name" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
                  <Input placeholder="Value (URL or #hex)" value={newAsset.value} onChange={e => setNewAsset({...newAsset, value: e.target.value})} />
                  <div className="flex gap-2">
                    <Button onClick={addAsset}>Add</Button>
                    <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="merch" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Merch 4 Ps Framework</CardTitle><CardDescription>From Berklee handbook — the complete merch strategy</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 border rounded-lg"><p className="font-medium text-blue-500">Product</p><p className="text-muted-foreground">Original designs, variety, trademark protection</p></div>
                <div className="p-3 border rounded-lg"><p className="font-medium text-green-500">Price</p><p className="text-muted-foreground">Cost-plus, competitive, bundle pricing</p></div>
                <div className="p-3 border rounded-lg"><p className="font-medium text-orange-500">Place</p><p className="text-muted-foreground">Online store, live shows, print-on-demand</p></div>
                <div className="p-3 border rounded-lg"><p className="font-medium text-purple-500">Promotion</p><p className="text-muted-foreground">Social media, email, urgency/scarcity</p></div>
              </CardContent>
            </Card>
            <div className="grid gap-3">
              {mockMerch.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-muted-foreground capitalize">{m.category}</p></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>${m.price}</span><span className="text-muted-foreground">Cost: ${m.cost}</span>
                    <span>{m.stock} in stock</span>
                    <Badge variant={m.status === "active" ? "default" : "destructive"}>{m.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4">
            <div className="flex justify-end"><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Deal</Button></div>
            <div className="grid gap-3">
              {mockDeals.map(d => (
                <Card key={d.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Handshake className="h-5 w-5 text-muted-foreground" />
                        <div><p className="font-medium">{d.brand}</p><p className="text-sm text-muted-foreground capitalize">{d.type}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        {d.value && <Badge variant="secondary">${d.value.toLocaleString()}</Badge>}
                        <Badge variant="outline">{d.status}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">{d.deliverables.map((del, i) => <Badge key={i} variant="secondary" className="text-xs">{del}</Badge>)}</div>
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
