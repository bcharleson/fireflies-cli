import type { z } from 'zod';
import type { FirefliesClient } from './client.js';

export interface CliArg {
  field: string;
  name: string;
  required?: boolean;
  description?: string;
}

export interface CliOption {
  field: string;
  flags: string;
  description: string;
}

export interface CliMapping {
  args?: CliArg[];
  options?: CliOption[];
}

export interface CommandDefinition<
  TInput extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
> {
  name: string;
  group: string;
  subcommand: string;
  description: string;
  examples?: string[];
  inputSchema: TInput;
  cliMappings: CliMapping;
  handler: (input: z.infer<TInput>, client: FirefliesClient) => Promise<unknown>;
}

// ── Fireflies domain types ────────────────────────────────────────────────────

export interface FirefliesUser {
  user_id: string;
  name: string;
  email: string;
  num_transcripts?: number;
  recent_meeting?: string;
  minutes_consumed?: number;
  is_admin?: boolean;
  integrations?: string[];
}

export interface Speaker {
  id: string;
  name: string;
}

export interface MeetingAttendee {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
}

export interface Sentence {
  speaker_name?: string;
  speaker_id?: string;
  text: string;
  raw_text?: string;
  start_time?: number;
  end_time?: number;
}

export interface AISummary {
  keywords?: string[];
  action_items?: string[];
  outline?: string[];
  shorthand_bullet?: string[];
  overview?: string;
  bullet_gist?: string;
  gist?: string;
  short_summary?: string;
  meeting_type?: string;
  topics_discussed?: string[];
}

export interface Transcript {
  id: string;
  title?: string;
  date?: string;
  dateString?: string;
  duration?: number;
  privacy?: string;
  transcript_url?: string;
  audio_url?: string;
  video_url?: string;
  is_live?: boolean;
  meeting_link?: string;
  calendar_type?: string;
  host_email?: string;
  organizer_email?: string;
  speakers?: Speaker[];
  meeting_attendees?: MeetingAttendee[];
  participants?: string[];
  sentences?: Sentence[];
  summary?: AISummary;
  user?: FirefliesUser;
}

export interface Soundbite {
  id: string;
  transcript_id?: string;
  name?: string;
  start_time?: number;
  end_time?: number;
  media_type?: string;
  summary?: string;
}

export interface Channel {
  id: string;
  name?: string;
  privacy?: string;
  members?: string[];
}

export interface AskFredThread {
  id: string;
  transcript_id?: string;
  created_at?: string;
  messages?: AskFredMessage[];
}

export interface AskFredMessage {
  role: string;
  content: string;
}

export interface AppOutput {
  app_id: string;
  transcript_id?: string;
  output?: string;
}

export interface UserGroup {
  id: string;
  name?: string;
  members?: string[];
}
