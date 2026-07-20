export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      corrections: {
        Row: {
          admin_notes: string | null
          correction_type: string
          created_at: string
          evidence_urls: string[] | null
          id: string
          message: string
          page_url: string | null
          public_summary: string | null
          published: boolean
          related_incident_id: string | null
          related_subject_id: string | null
          status: Database["public"]["Enums"]["correction_status"]
          submitter_contact: string | null
          submitter_name: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          correction_type: string
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          message: string
          page_url?: string | null
          public_summary?: string | null
          published?: boolean
          related_incident_id?: string | null
          related_subject_id?: string | null
          status?: Database["public"]["Enums"]["correction_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          correction_type?: string
          created_at?: string
          evidence_urls?: string[] | null
          id?: string
          message?: string
          page_url?: string | null
          public_summary?: string | null
          published?: boolean
          related_incident_id?: string | null
          related_subject_id?: string | null
          status?: Database["public"]["Enums"]["correction_status"]
          submitter_contact?: string | null
          submitter_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "corrections_related_incident_id_fkey"
            columns: ["related_incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corrections_related_subject_id_fkey"
            columns: ["related_subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          archive_url: string | null
          attribution: string | null
          caption: string | null
          capture_time: string | null
          copyright_status: string | null
          created_at: string
          file_size: number | null
          id: string
          incident_id: string | null
          location: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string | null
          notes: string | null
          original_filename: string | null
          permission_status: string | null
          private_original_path: string | null
          public_media_url: string | null
          published: boolean
          redaction_notes: string | null
          redactions_applied: boolean
          sha256: string | null
          source_name: string | null
          source_url: string | null
          subject_id: string | null
          title: string | null
          updated_at: string
          upload_time: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          archive_url?: string | null
          attribution?: string | null
          caption?: string | null
          capture_time?: string | null
          copyright_status?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          incident_id?: string | null
          location?: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type?: string | null
          notes?: string | null
          original_filename?: string | null
          permission_status?: string | null
          private_original_path?: string | null
          public_media_url?: string | null
          published?: boolean
          redaction_notes?: string | null
          redactions_applied?: boolean
          sha256?: string | null
          source_name?: string | null
          source_url?: string | null
          subject_id?: string | null
          title?: string | null
          updated_at?: string
          upload_time?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          archive_url?: string | null
          attribution?: string | null
          caption?: string | null
          capture_time?: string | null
          copyright_status?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          incident_id?: string | null
          location?: string | null
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string | null
          notes?: string | null
          original_filename?: string | null
          permission_status?: string | null
          private_original_path?: string | null
          public_media_url?: string | null
          published?: boolean
          redaction_notes?: string | null
          redactions_applied?: boolean
          sha256?: string | null
          source_name?: string | null
          source_url?: string | null
          subject_id?: string | null
          title?: string | null
          updated_at?: string
          upload_time?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "evidence_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_evidence: {
        Row: {
          basis_note: string
          created_at: string
          evidence_id: string | null
          id: string
          subject_id: string
        }
        Insert: {
          basis_note: string
          created_at?: string
          evidence_id?: string | null
          id?: string
          subject_id: string
        }
        Update: {
          basis_note?: string
          created_at?: string
          evidence_id?: string | null
          id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identity_evidence_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "identity_evidence_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          city: string | null
          country: string | null
          cover_media: string | null
          created_at: string
          end_time: string | null
          id: string
          incident_date: string | null
          latitude: number | null
          location_description: string | null
          longitude: number | null
          published: boolean
          slug: string
          start_time: string | null
          state: string | null
          summary: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          city?: string | null
          country?: string | null
          cover_media?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          incident_date?: string | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          published?: boolean
          slug: string
          start_time?: string | null
          state?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          city?: string | null
          country?: string | null
          cover_media?: string | null
          created_at?: string
          end_time?: string | null
          id?: string
          incident_date?: string | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          published?: boolean
          slug?: string
          start_time?: string | null
          state?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          incident_id: string | null
          page_url: string | null
          published: boolean
          response_text: string
          status: Database["public"]["Enums"]["reply_status"]
          subject_id: string | null
          submitter_contact: string
          submitter_name: string
          submitter_role: string | null
          supporting_urls: string[] | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          incident_id?: string | null
          page_url?: string | null
          published?: boolean
          response_text: string
          status?: Database["public"]["Enums"]["reply_status"]
          subject_id?: string | null
          submitter_contact: string
          submitter_name: string
          submitter_role?: string | null
          supporting_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          incident_id?: string | null
          page_url?: string | null
          published?: boolean
          response_text?: string
          status?: Database["public"]["Enums"]["reply_status"]
          subject_id?: string | null
          submitter_contact?: string
          submitter_name?: string
          submitter_role?: string | null
          supporting_urls?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          archived_url: string | null
          created_at: string
          evidence_id: string | null
          id: string
          incident_id: string | null
          publication_date: string | null
          publisher: string | null
          reliability_notes: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          title: string | null
          url: string | null
        }
        Insert: {
          archived_url?: string | null
          created_at?: string
          evidence_id?: string | null
          id?: string
          incident_id?: string | null
          publication_date?: string | null
          publisher?: string | null
          reliability_notes?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          title?: string | null
          url?: string | null
        }
        Update: {
          archived_url?: string | null
          created_at?: string
          evidence_id?: string | null
          id?: string
          incident_id?: string | null
          publication_date?: string | null
          publisher?: string | null
          reliability_notes?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_incidents: {
        Row: {
          created_at: string
          id: string
          incident_id: string
          relation_note: string | null
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          incident_id: string
          relation_note?: string | null
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          incident_id?: string
          relation_note?: string | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subject_incidents_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subject_incidents_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          bio_summary: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          identity_notes: string | null
          identity_status: Database["public"]["Enums"]["identity_status"]
          is_unidentified: boolean
          organization: string | null
          primary_image: string | null
          published: boolean
          role: string | null
          slug: string
          subject_number: number
          updated_at: string
        }
        Insert: {
          bio_summary?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          identity_notes?: string | null
          identity_status?: Database["public"]["Enums"]["identity_status"]
          is_unidentified?: boolean
          organization?: string | null
          primary_image?: string | null
          published?: boolean
          role?: string | null
          slug: string
          subject_number?: number
          updated_at?: string
        }
        Update: {
          bio_summary?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          identity_notes?: string | null
          identity_status?: Database["public"]["Enums"]["identity_status"]
          is_unidentified?: boolean
          organization?: string | null
          primary_image?: string | null
          published?: boolean
          role?: string | null
          slug?: string
          subject_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_dashboard_stats: { Args: never; Returns: Json }
      get_archive_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      correction_status: "pending" | "accepted" | "rejected" | "applied"
      identity_status: "verified" | "corroborated" | "unconfirmed"
      media_type: "photo" | "video" | "document" | "audio"
      reply_status: "pending" | "approved" | "rejected"
      source_type:
        | "primary"
        | "reputable_media"
        | "eyewitness"
        | "social_media"
        | "government_record"
        | "legal_court_record"
      verification_status:
        | "verified"
        | "corroborated"
        | "partially_verified"
        | "unverified"
        | "disputed"
        | "corrected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      correction_status: ["pending", "accepted", "rejected", "applied"],
      identity_status: ["verified", "corroborated", "unconfirmed"],
      media_type: ["photo", "video", "document", "audio"],
      reply_status: ["pending", "approved", "rejected"],
      source_type: [
        "primary",
        "reputable_media",
        "eyewitness",
        "social_media",
        "government_record",
        "legal_court_record",
      ],
      verification_status: [
        "verified",
        "corroborated",
        "partially_verified",
        "unverified",
        "disputed",
        "corrected",
      ],
    },
  },
} as const
