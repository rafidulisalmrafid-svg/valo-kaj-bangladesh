export interface User {
    id: number;
    name: string;
    email: string;
    mobile?: string;
    role: 'visitor' | 'user' | 'district_moderator' | 'division_moderator' | 'award_committee' | 'super_admin';
    avatar?: string;
    gender?: string;
    date_of_birth?: string;
    division?: string;
    district?: string;
    upazila?: string;
    organization?: string;
    bio?: string;
    social_links?: Record<string, string>;
    impact_score: number;
}

export interface Category {
    id: number;
    slug: string;
    name: string;
    name_bn: string;
    icon: string;
    description?: string;
    deed_count: number;
}

export interface GoodDeed {
    id: number;
    user_id?: number | null;
    guest_name?: string | null;
    guest_phone?: string | null;
    guest_email?: string | null;
    is_anonymous?: boolean;
    category_id: number;
    title: string;
    description: string;
    video_url?: string | null;
    photos?: string[];
    thumbnail?: string;
    division: string;
    district: string;
    upazila?: string | null;
    location?: string | null;
    google_map_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    deed_date: string;
    beneficiaries_count: number;
    team_name?: string | null;
    organization?: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'needs_info';
    ai_trust_score: number;
    ai_flags?: string[];
    review_notes?: string | null;
    likes_count: number;
    comments_count: number;
    views_count: number;
    impact_points: number;
    is_featured: boolean;
    created_at: string;
    user?: User;
    category?: Category;
    engagements?: DeedEngagement[];
}

export interface DeedEngagement {
    id: number;
    user_id: number;
    good_deed_id: number;
    type: 'like' | 'reaction' | 'bookmark' | 'comment' | 'share' | 'report';
    reaction_type?: 'like' | 'love' | 'celebrate' | 'sad' | 'angry';
    comment?: string;
    is_hidden?: boolean;
    hidden_by?: number | null;
    user?: User;
    good_deed?: GoodDeed;
    created_at: string;
}

export interface Campaign {
    id: number;
    title: string;
    title_bn: string;
    description: string;
    category_id?: number;
    banner?: string;
    division?: string | null;
    district?: string | null;
    target_beneficiaries: number;
    current_beneficiaries: number;
    target_deeds: number;
    current_deeds: number;
    organizer_name: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'upcoming' | 'completed';
    category?: Category;
    organizer?: User;
    participants?: { id: number; user_id: number }[];
}

export interface Certificate {
    id: number;
    certificate_number: string;
    user_id: number;
    good_deed_id?: number | null;
    campaign_id?: number | null;
    title: string;
    recipient_name: string;
    district: string;
    division: string;
    achievement: string;
    issue_date: string;
    qr_code_url?: string;
    verification_token: string;
    user?: User;
    good_deed?: GoodDeed;
}

export interface Award {
    id: number;
    month: string;
    year: number;
    level: 'district' | 'division' | 'national';
    rank_name: string;
    title: string;
    user_id: number;
    good_deed_id?: number | null;
    district?: string | null;
    division?: string | null;
    citation: string;
    badge_color: string;
    user?: User;
    good_deed?: GoodDeed;
}

export interface AuditLog {
    id: number;
    user_id?: number | null;
    action: string;
    target_type: string;
    target_id?: number | null;
    details?: any;
    ip_address?: string | null;
    created_at: string;
    user?: User;
}

export interface UserNotification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export interface EmailTemplate {
    id: number;
    key: string;
    name: string;
    subject: string;
    body: string;
    sender_email: string;
    sender_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
        info?: string;
    };
}
