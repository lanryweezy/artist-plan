"use client"

import { useState } from "react"
import { knowledgeGraph, getGraphNeighbors } from "@/lib/knowledge-base"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const typeColors: Record<string, string> = {
  concept: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  entity: "bg-green-500/10 text-green-500 border-green-500/30",
  revenue_stream: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  organization: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  right: "bg-red-500/10 text-red-500 border-red-500/30",
  license: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  deal: "bg-teal-500/10 text-teal-500 border-teal-500/30",
}

export function KnowledgeGraphViz() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const neighbors = selectedNode ? getGraphNeighbors(selectedNode) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Music Business Knowledge Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {knowledgeGraph.nodes.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              className={`p-2 border rounded-lg text-xs text-left transition-all ${
                selectedNode === node.id
                  ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                  : "hover:border-primary/50"
              }`}
            >
              <p className="font-medium truncate">{node.label}</p>
              <p className="text-muted-foreground capitalize">{node.type.replace(/_/g, " ")}</p>
            </button>
          ))}
        </div>

        {selectedNode && neighbors.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">
              Connections from {knowledgeGraph.nodes.find(n => n.id === selectedNode)?.label}:
            </p>
            <div className="space-y-1">
              {neighbors.map((n, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className={`text-xs ${typeColors[n.node.type]}`}>
                    {n.node.type.replace(/_/g, " ")}
                  </Badge>
                  <span>{n.node.label}</span>
                  <span className="text-muted-foreground text-xs">({n.edge.relationship})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <p>This graph connects {knowledgeGraph.nodes.length} concepts with {knowledgeGraph.edges.length} relationships. Click any node to see how it connects to other parts of the music business.</p>
        </div>
      </CardContent>
    </Card>
  )
}
