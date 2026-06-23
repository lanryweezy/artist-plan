"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Palette,
  Upload,
  Trash2,
  Copy,
  Check,
  Image,
  Type,
  Eye,
  Edit,
  ShoppingBag,
  DollarSign,
  MapPin,
  Megaphone,
  Handshake,
  Star,
  Package,
  TrendingUp,
  Users,
  Target
} from "lucide-react"

interface BrandAsset {
  id: string
  name: string
  type: "logo" | "color" | "font" | "image"
  value: string
  url?: string
  isPrimary?: boolean
}

interface MerchItem {
  id: string
  name: string
  category: "apparel" | "accessory" | "music" | "lifestyle" | "other"
  price: number
  cost: number
  stock: number
  status: "active" | "draft" | "sold_out"
  salesChannel: "online" | "live" | "both"
}

interface BrandDeal {
  id: string
  brand: string
  type: "endorsement" | "sponsorship" | "partnership" | "sync"
  status: "active" | "negotiating" | "expired" | "pending"
  value?: number
  startDate: string
  endDate?: string
  deliverables: string[]
}

const mockAssets: BrandAsset[] = [
  { id: "1", name: "Primary Logo", type: "logo", value: "https://placehold.co/200x200/7f5af0/ffffff?text=AP", isPrimary: true },
  { id: "2", name: "Light Logo", type: "logo", value: "https://placehold.co/200x200/ffffff/000000?text=AP" },
  { id: "3", name: "Primary Purple", type: "color", value: "#7f5af0", isPrimary: true },
  { id: "4", name: "Secondary Green", type: "color", value: "#2cb67d" },
  { id: "5", name: "Accent Orange", type: "color", value: "#f2994a" },
  { id: "6", name: "Background Dark", type: "color", value: "#16161a" },
  { id: "7", name: "Montserrat", type: "font", value: "Montserrat - Headings" },
  { id: "8", name: "Open Sans", type: "font", value: "Open Sans - Body" },
]

const mockMerch: MerchItem[] = [
  { id: "m1", name: "Vintage Logo Tee", category: "apparel", price: 35, cost: 12, stock: 150, status: "active", salesChannel: "both" },
  { id: "m2", name: "Limited Edition Hoodie", category: "apparel", price: 65, cost: 25, stock: 0, status: "sold_out", salesChannel: "both" },
  { id: "m3", name: "Vinyl - Debut Album", category: "music", price: 28, cost: 8, stock: 200, status: "active", salesChannel: "both" },
  { id: "m4", name: "Enamel Pin Set", category: "accessory", price: 12, cost: 3, stock: 300, status: "active", salesChannel: "online" },
  { id: "m5", name: "Signed Poster", category: "lifestyle", price: 25, cost: 5, stock: 50, status: "active", salesChannel: "live" },
  { id: "m6", name: "Sticker Pack", category: "accessory", price: 8, cost: 1, stock: 500, status: "active", salesChannel: "both" },
]

const mockDeals: BrandDeal[] = [
  {
    id: "d1",
    brand: "Fender Guitars",
    type: "endorsement",
    status: "active",
    value: 5000,
    startDate: "2026-01-01",
    endDate: "2027-01-01",
    deliverables: ["Social posts (4/month)", "Use Fender on tour", "Clinic appearance"]
  },
  {
    id: "d2",
    brand: "Spotify",
    type: "partnership",
    status: "active",
    startDate: "2026-03-01",
    deliverables: ["Playlist features", "Social promotion", "Behind-the-scenes content"]
  },
  {
    id: "d3",
    brand: "Local Brewery",
    type: "sponsorship",
    status: "negotiating",
    value: 2500,
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    deliverables: ["Tour sponsor", "Logo on merch", "Event hosting"]
  },
]

const typeIcons: Record<string, React.ElementType> = {
  logo: Image,
  color: Palette,
  font: Type,
  image: Image,
}

const typeColors: Record<string, string> = {
  logo: "bg-purple-100 text-purple-800",
  color: "bg-blue-100 text-blue-800",
  font: "bg-green-100 text-green-800",
  image: "bg-orange-100 text-orange-800",
}

function BrandAssetsTab() {
  const [assets, setAssets] = useState<BrandAsset[]>(mockAssets)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newAsset, setNewAsset] = useState({ name: "", type: "logo", value: "" })

  const logos = assets.filter((a) => a.type === "logo")
  const colors = assets.filter((a) => a.type === "color")
  const fonts = assets.filter((a) => a.type === "font")

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  const handleAdd = () => {
    if (!newAsset.name || !newAsset.value) return
    const asset: BrandAsset = {
      id: Date.now().toString(),
      name: newAsset.name,
      type: newAsset.type as BrandAsset["type"],
      value: newAsset.value,
    }
    setAssets((prev) => [...prev, asset])
    setNewAsset({ name: "", type: "logo", value: "" })
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Brand Asset</DialogTitle>
              <DialogDescription>
                Add a new logo, color, font, or image to your brand kit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g., Primary Logo"
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                >
                  <option value="logo">Logo</option>
                  <option value="color">Color</option>
                  <option value="font">Font</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  value={newAsset.value}
                  onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                  placeholder={newAsset.type === "color" ? "#7f5af0" : "URL or description"}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Add Asset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Brand Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{logos.length}</p>
                <p className="text-xs text-muted-foreground">Logos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{colors.length}</p>
                <p className="text-xs text-muted-foreground">Colors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Type className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{fonts.length}</p>
                <p className="text-xs text-muted-foreground">Fonts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-green-500" />
              <div>
                <p className="text-2xl font-bold">{assets.length}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette
          </CardTitle>
          <CardDescription>Your brand colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.id} className="group relative">
                <div
                  className="h-24 rounded-lg border-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  style={{ backgroundColor: color.value }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.value}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleCopy(color.value, color.id)}
                    >
                      {copiedId === color.id ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={() => handleDelete(color.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {color.isPrimary && (
                  <Badge className="absolute top-2 right-2 text-xs">Primary</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logos
          </CardTitle>
          <CardDescription>Your brand logos and marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {logos.map((logo) => (
              <div key={logo.id} className="group relative border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={logo.value}
                    alt={logo.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{logo.name}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={() => handleDelete(logo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {logo.isPrimary && (
                  <Badge className="absolute top-2 right-2 text-xs">Primary</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fonts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>Your brand fonts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fonts.map((font) => (
              <div key={font.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{font.name}</p>
                    <p className="text-sm text-muted-foreground">{font.value}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500"
                    onClick={() => handleDelete(font.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MerchStrategyTab() {
  const totalRevenue = mockMerch.reduce((sum, m) => sum + (m.price * Math.floor(m.stock * 0.3)), 0)
  const totalProfit = mockMerch.reduce((sum, m) => sum + ((m.price - m.cost) * Math.floor(m.stock * 0.3)), 0)
  const avgMargin = Math.round(((totalProfit / totalRevenue) * 100) || 0)

  return (
    <div className="space-y-6">
      {/* Merch Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockMerch.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Est. Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{avgMargin}%</p>
                <p className="text-xs text-muted-foreground">Avg Margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{mockMerch.filter(m => m.stock > 0).length}</p>
                <p className="text-xs text-muted-foreground">In Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The 4 Ps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Design merch that reflects your brand identity and resonates with your audience.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Create original designs that match your brand</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Offer variety: apparel, accessories, music, lifestyle</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Protect your brand with trademarks</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Price */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Set prices that cover costs and provide profit while remaining attractive to fans.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Cost-plus: Calculate total costs, add margin</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Competitive: Check what similar artists charge</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Bundle pricing: Combo deals increase order value</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Place */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              Place
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose where and how to sell to maximize reach and revenue.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Online: Shopify, Bandcamp, Big Cartel</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Live shows: Attractive merch booth experience</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Print-on-demand vs bulk manufacturing</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Promotion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="h-5 w-5" />
              Promotion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Promote merch through social media, email, and live shows.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Social: Behind-the-scenes, fan photos, offers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Email: Targeted campaigns, limited deals</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-green-500" />
                <span>Urgency: Limited editions, pre-orders</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Merch Inventory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Merch Inventory</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMerch.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                    <p className="text-xs text-muted-foreground">Cost: ${item.cost}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.stock}</p>
                    <p className="text-xs text-muted-foreground">In stock</p>
                  </div>
                  <Badge variant={item.status === "active" ? "default" : item.status === "sold_out" ? "destructive" : "secondary"}>
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Merch Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>Merch Ideas from Berklee Handbook</CardTitle>
          <CardDescription>Popular merch items for independent artists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {[
              "T-shirts", "Hoodies", "Tank tops", "Crop tops",
              "Beanies", "Baseball caps", "Trucker hats", "Bandanas",
              "Pins and buttons", "Patches", "Phone cases", "Tote bags",
              "Vinyl records", "CDs", "Posters", "Signed photos",
              "Handwritten lyrics", "Journals", "Stickers", "Jewelry",
              "Water bottles", "Coffee mugs", "Socks", "Sunglasses"
            ].map((item) => (
              <div key={item} className="p-2 bg-muted rounded text-center">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BrandPartnershipsTab() {
  const statusColor = (status: BrandDeal["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "negotiating":
        return "bg-yellow-500/10 text-yellow-500"
      case "expired":
        return "bg-red-500/10 text-red-500"
      case "pending":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brand Deals & Partnerships</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Handshake className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockDeals.length}</p>
                <p className="text-xs text-muted-foreground">Total Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  ${mockDeals.reduce((sum, d) => sum + (d.value || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{mockDeals.filter(d => d.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Active Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals List */}
      <div className="grid gap-4">
        {mockDeals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{deal.brand}</CardTitle>
                  <CardDescription className="capitalize">{deal.type}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {deal.value && (
                    <Badge variant="secondary" className="text-lg">
                      ${deal.value.toLocaleString()}
                    </Badge>
                  )}
                  <Badge variant="outline" className={statusColor(deal.status)}>
                    <span className="capitalize">{deal.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(deal.startDate).toLocaleDateString()}</p>
                </div>
                {deal.endDate && (
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(deal.endDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{deal.type}</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-2">
                  {deal.deliverables.map((item, i) => (
                    <Badge key={i} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sponsorship Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Brand Partnerships Matter</CardTitle>
          <CardDescription>Key benefits from industry research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Fan Trust</p>
              <p className="text-muted-foreground">58% of attendees trust brands associated with live music experiences</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Millennial Connection</p>
              <p className="text-muted-foreground">8 of 10 millennials feel live music is the most effective way to connect</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Purchase Intent</p>
              <p className="text-muted-foreground">43% are more likely to make a purchase at a concert</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Brand Loyalty</p>
              <p className="text-muted-foreground">93% of millennials prefer brands that sponsor live events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BrandPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Brand</h1>
          <p className="text-muted-foreground">Manage your brand assets, merch strategy, and partnerships</p>
        </div>

        <Tabs defaultValue="assets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assets" className="gap-2">
              <Palette className="h-4 w-4" />
              Brand Assets
            </TabsTrigger>
            <TabsTrigger value="merch" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Merch Strategy
            </TabsTrigger>
            <TabsTrigger value="partnerships" className="gap-2">
              <Handshake className="h-4 w-4" />
              Partnerships
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <BrandAssetsTab />
          </TabsContent>

          <TabsContent value="merch">
            <MerchStrategyTab />
          </TabsContent>

          <TabsContent value="partnerships">
            <BrandPartnershipsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
