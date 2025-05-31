"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface PhotoArticle {
  id: number
  title: string
  images: string[]
  publishedAt: string
}

export default function PhotographyPage() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<PhotoArticle[]>([])

  useEffect(() => {
    // In a real app, fetch from API
    const publishedArticles = JSON.parse(localStorage.getItem("publishedArticles") || "[]")
    setArticles(publishedArticles.filter((article: any) => article.category === "photography"))
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t("category.photography")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                {article.images?.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
