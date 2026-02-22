/* 
  Supabase 초기화 파일 
  * 프로젝트명: portfolio-stats
  * 목적: 포트폴리오 방문객 좋아요 카운터 연동
*/
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://raxkvcwspqqqgwspingu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGt2Y3dzcHFxcWd3c3Bpbmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDE1NzksImV4cCI6MjA4NzMxNzU3OX0.YoJCuNx1PMF6j_UtIwylZKijb0lM7vzRw-e4MOrhzhs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
