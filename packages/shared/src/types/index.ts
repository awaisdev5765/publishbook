// ─── Enums ──────────────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN  = 'ADMIN',
  AUTHOR = 'AUTHOR',
  CLIENT = 'CLIENT',
}

export enum BookStatus {
  DRAFT     = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  PUBLISHED = 'PUBLISHED',
}

export enum OrderStatus {
  PENDING   = 'PENDING',
  PAID      = 'PAID',
  CANCELLED = 'CANCELLED',
}

// ─── Entity Interfaces ───────────────────────────────────────────────────────

export interface User {
  id:        string
  name:      string
  email:     string
  role:      UserRole
  avatarUrl: string | null
  createdAt: Date
}

export interface Book {
  id:       string
  title:    string
  genre:    string
  status:   BookStatus
  authorId: string
  coverUrl: string | null
  synopsis: string | null
}

export interface Order {
  id:              string
  userId:          string
  serviceType:     string
  amount:          number
  status:          OrderStatus
  stripeSessionId: string | null
  createdAt:       Date
}

export interface Review {
  id:          string
  userId:      string
  bookId:      string
  rating:      number
  content:     string
  isPublished: boolean
  createdAt:   Date
}

export interface BlogPost {
  id:          string
  title:       string
  slug:        string
  content:     string
  authorId:    string
  publishedAt: Date | null
  tags:        string[]
}

export interface ContactMessage {
  id:        string
  name:      string
  email:     string
  message:   string
  isRead:    boolean
  createdAt: Date
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data:     T
  message?: string
  success:  boolean
}

export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface AuthTokens {
  accessToken:  string
  refreshToken: string
}

// ─── Service Types ───────────────────────────────────────────────────────────

export type ServiceType =
  | 'EDITING'
  | 'COVER_DESIGN'
  | 'DISTRIBUTION'
  | 'MARKETING'
  | 'FULL_PACKAGE'

export interface ServicePackage {
  id:          string
  name:        string
  type:        ServiceType
  description: string
  priceMonthly: number
  priceAnnual:  number
  features:    string[]
  isPopular:   boolean
}
