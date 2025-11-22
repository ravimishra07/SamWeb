#!/usr/bin/env python3
"""
DSA Progress Tracker
Tracks your DSA practice progress and generates insights from your daily logs.
"""

import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

class DSAProgressTracker:
    def __init__(self, logs_dir="data/dsa_logs/daily"):
        self.logs_dir = logs_dir
        self.progress_data = []
        self.load_progress_data()
    
    def load_progress_data(self):
        """Load DSA practice data from separate DSA logs."""
        if not os.path.exists(self.logs_dir):
            print(f"DSA logs directory not found: {self.logs_dir}")
            print("Creating directory structure...")
            os.makedirs(self.logs_dir, exist_ok=True)
            return
        
        for filename in os.listdir(self.logs_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.logs_dir, filename)
                try:
                    with open(filepath, 'r') as f:
                        log_data = json.load(f)
                    
                    # All DSA log files contain DSA data
                    self.progress_data.append(log_data)
                except Exception as e:
                    print(f"Error reading {filename}: {e}")
    
    def get_weekly_progress(self, days=7):
        """Get progress for the last N days."""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        weekly_data = []
        for log in self.progress_data:
            try:
                # Use date field for DSA logs
                log_date = datetime.strptime(log['date'], '%Y-%m-%d')
                if log_date >= cutoff_date:
                    weekly_data.append(log)
            except:
                continue
        
        return weekly_data
    
    def analyze_patterns(self, data):
        """Analyze performance by pattern."""
        pattern_stats = defaultdict(lambda: {
            'problems_solved': 0,
            'total_time': 0,
            'ratings': [],
            'success_count': 0
        })
        
        for log in data:
            # DSA logs have problems_solved directly
            for problem in log.get('problems_solved', []):
                pattern = problem.get('pattern', 'Unknown')
                pattern_stats[pattern]['problems_solved'] += 1
                pattern_stats[pattern]['total_time'] += problem.get('time_taken', 0)
                pattern_stats[pattern]['ratings'].append(problem.get('rating', 0))
                
                if problem.get('rating', 0) >= 7:
                    pattern_stats[pattern]['success_count'] += 1
        
        # Calculate averages
        for pattern, stats in pattern_stats.items():
            if stats['problems_solved'] > 0:
                stats['avg_time'] = stats['total_time'] / stats['problems_solved']
                stats['success_rate'] = stats['success_count'] / stats['problems_solved']
                stats['avg_rating'] = statistics.mean(stats['ratings']) if stats['ratings'] else 0
        
        return pattern_stats
    
    def get_weak_areas(self, data):
        """Identify weak areas from logs."""
        weak_areas = defaultdict(int)
        
        for log in data:
            # DSA logs have weak_areas directly
            for area in log.get('weak_areas', []):
                weak_areas[area] += 1
        
        return dict(sorted(weak_areas.items(), key=lambda x: x[1], reverse=True))
    
    def get_productivity_insights(self, data):
        """Analyze when you're most productive."""
        productivity_by_hour = defaultdict(list)
        productivity_by_mood = defaultdict(list)
        
        for log in data:
            try:
                # Use date field for DSA logs
                log_date = datetime.strptime(log['date'], '%Y-%m-%d')
                hour = 9  # Default to morning session time
                
                problems_solved = len(log.get('problems_solved', []))
                total_time = log.get('duration_minutes', 0)
                
                if total_time > 0:
                    efficiency = problems_solved / (total_time / 60)  # problems per hour
                    productivity_by_hour[hour].append(efficiency)
                
                mood = log.get('mood_before', 0)
                if mood > 0:
                    productivity_by_mood[mood].append(efficiency)
                    
            except:
                continue
        
        # Calculate averages
        hourly_avg = {hour: statistics.mean(values) for hour, values in productivity_by_hour.items()}
        mood_avg = {mood: statistics.mean(values) for mood, values in productivity_by_mood.items()}
        
        return {
            'best_hours': sorted(hourly_avg.items(), key=lambda x: x[1], reverse=True)[:3],
            'best_mood': sorted(mood_avg.items(), key=lambda x: x[1], reverse=True)[:3]
        }
    
    def generate_report(self, days=7):
        """Generate a comprehensive progress report."""
        weekly_data = self.get_weekly_progress(days)
        
        if not weekly_data:
            print("No DSA practice data found for the last {} days.".format(days))
            print("Start by creating your first DSA log in data/dsa_logs/daily/")
            return
        
        print(f"\n📊 DSA Progress Report (Last {days} days)")
        print("=" * 50)
        
        # Overall stats
        total_problems = sum(len(log.get('problems_solved', [])) for log in weekly_data)
        total_time = sum(log.get('duration_minutes', 0) for log in weekly_data)
        
        print(f"📈 Overall Progress:")
        print(f"   Problems solved: {total_problems}")
        print(f"   Total time: {total_time} minutes")
        print(f"   Average time per problem: {total_time/total_problems:.1f} min" if total_problems > 0 else "   No problems solved")
        
        # Pattern analysis
        pattern_stats = self.analyze_patterns(weekly_data)
        if pattern_stats:
            print(f"\n🎯 Pattern Performance:")
            for pattern, stats in pattern_stats.items():
                success_rate = stats['success_rate'] * 100
                avg_time = stats['avg_time']
                print(f"   {pattern}: {stats['problems_solved']} problems, {success_rate:.1f}% success, {avg_time:.1f} min avg")
        
        # Weak areas
        weak_areas = self.get_weak_areas(weekly_data)
        if weak_areas:
            print(f"\n⚠️  Weak Areas (mentioned {days} times):")
            for area, count in list(weak_areas.items())[:5]:
                print(f"   {area}: {count} times")
        
        # Productivity insights
        productivity = self.get_productivity_insights(weekly_data)
        if productivity['best_hours']:
            print(f"\n⏰ Best Productivity Hours:")
            for hour, efficiency in productivity['best_hours']:
                print(f"   {hour}:00 - {efficiency:.2f} problems/hour")
        
        if productivity['best_mood']:
            print(f"\n😊 Best Performance at Mood Level:")
            for mood, efficiency in productivity['best_mood']:
                print(f"   Mood {mood}/10 - {efficiency:.2f} problems/hour")
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        if pattern_stats:
            worst_pattern = min(pattern_stats.items(), key=lambda x: x[1]['success_rate'])
            print(f"   Focus on: {worst_pattern[0]} (success rate: {worst_pattern[1]['success_rate']*100:.1f}%)")
        
        if weak_areas:
            top_weak_area = list(weak_areas.keys())[0]
            print(f"   Practice: {top_weak_area}")
        
        if productivity['best_hours']:
            best_hour = productivity['best_hours'][0][0]
            print(f"   Schedule practice at: {best_hour}:00")
    
    def suggest_next_problems(self, weak_areas):
        """Suggest problems to practice based on weak areas."""
        suggestions = {
            'edge cases': ['Two Sum', '3Sum', 'Container With Most Water'],
            'string manipulation': ['Valid Palindrome', 'Longest Substring Without Repeating Characters'],
            'sliding window': ['Minimum Window Substring', 'Longest Substring Without Repeating Characters'],
            'two pointers': ['3Sum', 'Container With Most Water', 'Trapping Rain Water'],
            'dynamic programming': ['Climbing Stairs', 'House Robber', 'Coin Change']
        }
        
        recommended = []
        for area in weak_areas[:3]:  # Top 3 weak areas
            if area.lower() in suggestions:
                recommended.extend(suggestions[area.lower()])
        
        return list(set(recommended))  # Remove duplicates

def main():
    tracker = DSAProgressTracker()
    
    print("🚀 DSA Progress Tracker")
    print("=" * 30)
    
    # Generate weekly report
    tracker.generate_report(7)
    
    # Get weak areas for suggestions
    weekly_data = tracker.get_weekly_progress(7)
    weak_areas = list(tracker.get_weak_areas(weekly_data).keys())
    
    if weak_areas:
        suggestions = tracker.suggest_next_problems(weak_areas)
        print(f"\n🎯 Suggested Problems to Practice:")
        for i, problem in enumerate(suggestions[:5], 1):
            print(f"   {i}. {problem}")

if __name__ == "__main__":
    main()
