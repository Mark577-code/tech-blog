import { 
  Code, 
  Camera, 
  BookOpen, 
  Boxes, 
  PenTool, 
  Heart, 
  Star, 
  Zap, 
  Globe, 
  Music,
  Hash
} from "lucide-react"

// 图标映射
const iconMap = {
  Code,
  Camera,
  BookOpen,
  Boxes,
  PenTool,
  Heart,
  Star,
  Zap,
  Globe,
  Music,
  Hash
} as const

interface CategoryIconProps {
  iconName: string
  className?: string
  size?: number
}

export default function CategoryIcon({ 
  iconName, 
  className = "h-4 w-4", 
  size 
}: CategoryIconProps) {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Hash
  
  const props = size !== undefined ? { className, size } : { className }
  
  return <IconComponent {...props} />
} 