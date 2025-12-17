export interface MediaMetadata {
  camera?: {
    make?: string;
  model?: string;
  lens?: string;
  focal_length?: number;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  flash?: boolean; };

  video?: {
    codec?: string;
    bitrate?: number;
    framerate?: number;
    resolution?: string;
    aspect_ratio?: string;};

  audio?: {
    codec?: string;
    bitrate?: number;
    sample_rate?: number;
    channels?: number;
    duration?: number;};

  document?: {
    pages?: number;
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    created_date?: string;
    modified_date?: string;};

  exif?: { [key: string]: unknown};

  gps?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    location?: string;};

  colors?: {
    dominant?: string;
    palette?: string[];};

  faces?: {
    count: number;
    detected: boolean;
    coordinates?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      confidence: number;
    }>;};

}
