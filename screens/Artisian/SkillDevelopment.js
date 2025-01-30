import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const colors = {
    primary: '#8C5E58',      // Earthy brown - main brand color 
    secondary: '#D4AA7D',    // Warm sand
    accent: '#E3B448',       // Golden yellow
    text: '#2A2922',         // Deep charcoal
    background: '#F5F2ED',   // Off-white
    muted: '#A49B8F',        // Neutral taupe
  };

const SkillDevelopment = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const buttonScale = new Animated.Value(1);

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?status=published');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/enrollments/user');
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const filterCoursesByLevel = (level) => {
    setSelectedLevel(level);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#8C5E58', '#8C5E58']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.headerText}>Skill Development</Text>
        </LinearGradient>

        {/* Search Bar */}
        <TouchableOpacity onPress={animateButton} activeOpacity={0.8}>
          <Animated.View style={[styles.searchBar, { transform: [{ scale: buttonScale }] }]}>
            <Text style={styles.searchPlaceholder}>Search for courses...</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Level Filter */}
        <Text style={styles.sectionTitle}>Difficulty Level</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelContainer}
        >
          <LevelButton 
            title="All Levels" 
            isSelected={selectedLevel === 'all'}
            onPress={() => filterCoursesByLevel('all')}
          />
          <LevelButton 
            title="Beginner" 
            isSelected={selectedLevel === 'beginner'}
            onPress={() => filterCoursesByLevel('beginner')}
          />
          <LevelButton 
            title="Intermediate" 
            isSelected={selectedLevel === 'intermediate'}
            onPress={() => filterCoursesByLevel('intermediate')}
          />
          <LevelButton 
            title="Advanced" 
            isSelected={selectedLevel === 'advanced'}
            onPress={() => filterCoursesByLevel('advanced')}
          />
        </ScrollView>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {courses
            .reduce((unique, course) => 
              unique.includes(course.category) ? unique : [...unique, course.category], 
              []
            )
            .map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <LinearGradient
                  colors={['#8C5E58', '#8C5E58']}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))
          }
        </ScrollView>

        {/* Top Rated Courses */}
        <Text style={styles.sectionTitle}>Top Rated Courses</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.courseContainer}
        >
          {courses
            .filter(course => course.averageRating >= 4)
            .map((course, index) => (
              <CourseCard
                key={index}
                thumbnail={{ uri: course.thumbnail }}
                title={course.title}
                rating={course.averageRating}
                description={course.description}
                price={course.price}
                level={course.level}
                duration={course.duration}
                totalEnrollments={course.totalEnrollments}
              />
            ))}
        </ScrollView>

        {/* Your Enrolled Courses */}
        <Text style={styles.sectionTitle}>Your Courses</Text>
        <View style={styles.ongoingContainer}>
          {enrolledCourses.map((enrollment, index) => (
            <OngoingCourseCard
              key={index}
              thumbnail={{ uri: enrollment.course.thumbnail }}
              title={enrollment.course.title}
              progress={`${enrollment.progress}%`}
              description={enrollment.course.description}
              status={enrollment.status}
              completedAt={enrollment.completedAt}
              duration={enrollment.course.duration}
            />
          ))}
        </View>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessContainer}>
          <QuickAccessButton icon="📚" title="My Learning" />
          <QuickAccessButton icon="📊" title="Progress" />
          <QuickAccessButton icon="🎖️" title="Certificates" />
          <QuickAccessButton icon="⭐" title="Wishlist" />
        </View>

        {/* Course Statistics */}
        <LinearGradient
          colors={['#D4AA7D', '#D4AA7D']}
          style={styles.statsContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.statsTitle}>Your Learning Stats</Text>
          <View style={styles.statsGrid}>
            <StatItem 
              title="Courses" 
              value={enrolledCourses.length} 
            />
            <StatItem 
              title="Completed" 
              value={enrolledCourses.filter(e => e.status === 'completed').length} 
            />
            <StatItem 
              title="In Progress" 
              value={enrolledCourses.filter(e => e.status === 'active').length} 
            />
            <StatItem 
              title="Hours" 
              value={enrolledCourses.reduce((acc, curr) => acc + curr.course.duration, 0)} 
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// Level Button Component
const LevelButton = ({ title, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[styles.levelButton, isSelected && styles.levelButtonSelected]} 
    onPress={onPress}
  >
    <Text style={[styles.levelText, isSelected && styles.levelTextSelected]}>{title}</Text>
  </TouchableOpacity>
);

// Course Card Component
const CourseCard = ({ thumbnail, title, rating, description, price, level, duration, totalEnrollments }) => (
  <TouchableOpacity style={styles.courseCard}>
    <Image source={thumbnail} style={styles.courseThumbnail} />
    <LinearGradient
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
      style={styles.courseOverlay}
    >
      <Text style={styles.courseTitle}>{title}</Text>
      <View style={styles.courseStats}>
        <Text style={styles.courseRating}>⭐ {rating}</Text>
        <Text style={styles.courseDuration}>⏱️ {duration}h</Text>
        <Text style={styles.courseEnrollments}>👥 {totalEnrollments}</Text>
      </View>
      <Text style={styles.courseLevel}>{level.toUpperCase()}</Text>
      <Text style={styles.courseDescription}>{description}</Text>
      <Text style={styles.coursePrice}>{price === 0 ? 'FREE' : `$${price}`}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Ongoing Course Card Component
const OngoingCourseCard = ({ thumbnail, title, progress, description, status, completedAt, duration }) => (
  <TouchableOpacity style={styles.ongoingCard}>
    <Image source={thumbnail} style={styles.ongoingThumbnail} />
    <View style={styles.ongoingDetails}>
      <Text style={styles.ongoingTitle}>{title}</Text>
      <Text style={styles.ongoingDescription}>{description}</Text>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={['#6A82FB', '#FC5C7D']}
          style={[styles.progressFill, { width: progress }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <View style={styles.ongoingStats}>
        <Text style={styles.progressText}>{progress} Complete</Text>
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        {completedAt && (
          <Text style={styles.completedText}>
            Completed on {new Date(completedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

// Quick Access Button Component
const QuickAccessButton = ({ icon, title }) => (
  <TouchableOpacity style={styles.quickAccessButton}>
    <LinearGradient
      colors={['#8C5E58', '#8C5E58']}
      style={styles.quickAccessGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.quickAccessIcon}>{icon}</Text>
      <Text style={styles.quickAccessTitle}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Stat Item Component
const StatItem = ({ title, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

// Updated Styles
const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  scrollContainer: {
    padding: 16,
  },
  
  // Header Styles
  header: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 50,
    backgroundColor: '#8C5E58',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },

  // Search Bar Styles
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchPlaceholder: {
    color: '#A49B8F',
    fontSize: 14,
  },

  // Section Title Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2922',
    marginVertical: 16,
  },

  // Level Filter Styles
  levelContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  levelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F2ED',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#8C5E58',
  },
  levelButtonSelected: {
    backgroundColor: '#8C5E58',
  },
  levelText: {
    color: '#8C5E58',
    fontSize: 14,
    fontWeight: '500',
  },
  levelTextSelected: {
    color: '#FFFFFF',
  },

  // Category Styles
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Course Card Styles
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    width: width * 0.85,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseRating: {
    fontSize: 14,
    color: '#E3B448',
    fontWeight: '600',
  },
  courseDuration: {
    fontSize: 14,
    color: '#A49B8F',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8C5E58',
  },

  // Ongoing Course Styles
  ongoingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ongoingThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  ongoingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  ongoingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 4,
  },
  ongoingDescription: {
    fontSize: 14,
    color: '#A49B8F',
    marginBottom: 8,
  },

  // Progress Bar Styles
  progressBar: {
    height: 6,
    backgroundColor: '#F5F2ED',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#A49B8F',
    marginTop: 4,
  },

  // Quick Access Styles
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  quickAccessButton: {
    width: width * 0.22,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quickAccessGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  quickAccessIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Stats Container Styles
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C5E58',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#A49B8F',
  },

  // Status Text Styles
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusActive: {
    color: '#4CAF50',
  },
  statusCompleted: {
    color: '#8C5E58',
  },
  completedText: {
    fontSize: 12,
    color: '#A49B8F',
    marginTop: 4,
  }
});

export default SkillDevelopment;