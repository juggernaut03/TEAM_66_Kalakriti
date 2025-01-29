import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Define project color scheme
const colors = {
  primary: '#8C5E58',    // Earthy brown
  secondary: '#D4AA7D',  // Warm sand
  accent: '#E3B448',     // Golden yellow
  text: '#2A2922',       // Deep charcoal
  background: '#F5F2ED', // Off-white
  muted: '#A49B8F',      // Neutral taupe
  success: '#4CAF50',
  warning: '#FFA000',
};

const Gamification = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [currentTasks, setCurrentTasks] = useState([
    { id: 1, text: 'List 5 products', completed: false, progress: 2, reward: '50 points' },
    { id: 2, text: 'Complete profile details', completed: true, progress: 1, reward: '30 points' },
    { id: 3, text: 'Share crafts story', completed: false, progress: 0, reward: '40 points' },
    { id: 4, text: 'Upload product photos', completed: false, progress: 3, reward: '25 points' }
  ]);

  const badges = [
    { id: 1, name: 'Master Artisan', icon: '🎨', description: 'Created 10 unique products', progress: 7, total: 10 },
    { id: 2, name: 'Top Seller', icon: '⭐', description: 'Achieved 50 sales', progress: 35, total: 50 },
    { id: 3, name: 'Community Leader', icon: '👥', description: 'Helped 20 members', progress: 18, total: 20 },
    { id: 4, name: 'Quality Expert', icon: '🏆', description: 'Maintained 4.5+ rating', progress: 4.3, total: 5 }
  ];

  const leaderboardData = [
    { id: 1, name: 'Rajesh Kumar', points: 1500, image: '/api/placeholder/200/200', rank: 1 },
    { id: 2, name: 'Priya Sharma', points: 1450, image: '/api/placeholder/200/200', rank: 2 },
    { id: 3, name: 'Amit Singh', points: 1400, image: '/api/placeholder/200/200', rank: 3 }
  ];

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState('');

  const handleTaskComplete = (taskId) => {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) {
          showAchievementNotification(`Task Completed: Earned ${task.reward}!`);
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setCurrentTasks(updatedTasks);
  };

  const showAchievementNotification = (message) => {
    setAchievementMessage(message);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  const BadgeModal = () => (
    <Modal
      visible={showBadgeModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowBadgeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedBadge?.name}</Text>
          <Text style={styles.modalIcon}>{selectedBadge?.icon}</Text>
          <Text style={styles.modalDescription}>{selectedBadge?.description}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${(selectedBadge?.progress / selectedBadge?.total) * 100}%` 
              }]} />
            </View>
            <Text style={styles.progressText}>
              {selectedBadge?.progress}/{selectedBadge?.total}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowBadgeModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
        >
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level 5</Text>
            <Text style={styles.pointsText}>1,200 Points</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.nextLevelText}>800 points to Level 6</Text>
        </LinearGradient>

        {/* Daily Quests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          {currentTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => handleTaskComplete(task.id)}
            >
              <Icon
                name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={task.completed ? colors.success : colors.muted}
              />
              <View style={styles.taskContent}>
                <Text style={[
                  styles.taskText,
                  task.completed && styles.taskCompleted
                ]}>{task.text}</Text>
                <Text style={styles.taskReward}>{task.reward}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={styles.badgeCard}
                onPress={() => {
                  setSelectedBadge(badge);
                  setShowBadgeModal(true);
                }}
              >
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <View style={styles.badgeProgress}>
                  <View style={styles.badgeProgressBar}>
                    <View 
                      style={[
                        styles.badgeProgressFill,
                        { width: `${(badge.progress / badge.total) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.badgeProgressText}>
                    {badge.progress}/{badge.total}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Artisans</Text>
          {leaderboardData.map((artisan) => (
            <View key={artisan.id} style={styles.leaderboardItem}>
              <Text style={styles.rank}>#{artisan.rank}</Text>
              <Image
                source={{ uri: artisan.image }}
                style={styles.artisanImage}
              />
              <View style={styles.artisanInfo}>
                <Text style={styles.artisanName}>{artisan.name}</Text>
                <Text style={styles.artisanPoints}>{artisan.points} Points</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Achievement Popup */}
      {showAchievement && (
        <Animated.View style={styles.achievementPopup}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <Text style={styles.achievementText}>{achievementMessage}</Text>
        </Animated.View>
      )}

      <BadgeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  levelInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  nextLevelText: {
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  taskContent: {
    marginLeft: 12,
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: colors.text,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  taskReward: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  badgeCard: {
    width: 150,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeProgress: {
    width: '100%',
  },
  badgeProgressBar: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    marginBottom: 4,
  },
  badgeProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  badgeProgressText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    width: 40,
  },
  artisanImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  artisanPoints: {
    fontSize: 14,
    color: colors.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  modalIcon: {
    fontSize: 48,
    marginVertical: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementPopup: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
});

export default Gamification;