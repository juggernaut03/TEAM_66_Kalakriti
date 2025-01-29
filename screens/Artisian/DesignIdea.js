import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DesignIdea = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample trending designs data
  const trendingDesigns = [
    {
      id: '1',
      title: 'Modern Pottery Patterns',
      category: 'Pottery',
      trending: '+45%',
      image: 'https://img.buzzfeed.com/buzzfeed-static/static/2024-07/30/18/asset/0881881b98ab/sub-buzz-622-1722363657-1.png?downsize=900:*&output-format=auto&output-quality=auto',
      demandRegions: ['Maharashtra', 'Gujarat']
    },
    {
      id: '2',
      title: 'Traditional Weaving Motifs',
      category: 'Textiles',
      trending: '+38%',
      image: 'https://mediaindia.eu/wp-content/uploads/2017/04/haatthhiiii-1200x1202.jpg',
      demandRegions: ['Rajasthan', 'Punjab']
    }
  ];

  // Sample market insights
  const marketInsights = [
    {
      id: '1',
      title: 'Eco-friendly Materials',
      description: 'Growing demand for sustainable crafts',
      growth: '+65%'
    },
    {
      id: '2',
      title: 'Traditional Patterns',
      description: 'Rising interest in cultural designs',
      growth: '+52%'
    }
  ];

  // Sample color palettes
  const colorPalettes = [
    {
      id: '1',
      name: 'Earthy Tones',
      colors: ['#8B4513', '#DEB887', '#D2691E', '#CD853F']
    },
    {
      id: '2',
      name: 'Festival Colors',
      colors: ['#FF4D4D', '#FFD700', '#4CAF50', '#9B4DFF']
    }
  ];

  const renderTrendingItem = ({ item }) => (
    <TouchableOpacity style={styles.trendingCard}>
      <Image
        source={{ uri: 'https://robbreport.com/wp-content/uploads/2019/12/andile-dyalvane_idlada-group_credit-adriaan-louw_sculpture.2.jpg?w=1000' }}
        style={styles.trendingImage}
      />
      <View style={styles.trendingContent}>
        <Text style={styles.trendingTitle}>{item.title}</Text>
        <Text style={styles.trendingCategory}>{item.category}</Text>
        <View style={styles.trendingStats}>
          <Icon name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.trendingValue}>{item.trending}</Text>
        </View>
        <Text style={styles.demandRegions}>
          Popular in: {item.demandRegions.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderColorPalette = ({ item }) => (
    <View style={styles.paletteCard}>
      <Text style={styles.paletteName}>{item.name}</Text>
      <View style={styles.colorsContainer}>
        {item.colors.map((color, index) => (
          <View
            key={index}
            style={[styles.colorBox, { backgroundColor: color }]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <LinearGradient
          colors={['#8C5E58', '#D4AA7D']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Design Ideas</Text>
          <Text style={styles.headerSubtitle}>Explore trends and get inspired</Text>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#A49B8F" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search design ideas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Trending Designs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Designs</Text>
          <FlatList
            data={trendingDesigns}
            renderItem={renderTrendingItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Market Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Insights</Text>
          {marketInsights.map(insight => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={styles.growthBadge}>
                  <Icon name="trending-up" size={16} color="#4CAF50" />
                  <Text style={styles.growthText}>{insight.growth}</Text>
                </View>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
          ))}
        </View>

        {/* Color Palettes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Color Palettes</Text>
          <FlatList
            data={colorPalettes}
            renderItem={renderColorPalette}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Design Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Design Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard}>
              <Icon name="palette" size={32} color="#8C5E58" />
              <Text style={styles.toolName}>Color Mixer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard}>
              <Icon name="grid-on" size={32} color="#8C5E58" />
              <Text style={styles.toolName}>Pattern Maker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard}>
              <Icon name="straighten" size={32} color="#8C5E58" />
              <Text style={styles.toolName}>Size Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard}>
              <Icon name="style" size={32} color="#8C5E58" />
              <Text style={styles.toolName}>Material Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 16,
  },
  trendingCard: {
    width: width * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: 150,
  },
  trendingContent: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2922',
  },
  trendingCategory: {
    fontSize: 14,
    color: '#A49B8F',
    marginTop: 4,
  },
  trendingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendingValue: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  demandRegions: {
    fontSize: 12,
    color: '#A49B8F',
    marginTop: 8,
  },
  insightCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2A2922',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthText: {
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  insightDescription: {
    marginTop: 8,
    color: '#A49B8F',
  },
  paletteCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    elevation: 2,
    width: 160,
  },
  paletteName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2A2922',
    marginBottom: 8,
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  toolName: {
    marginTop: 8,
    fontSize: 14,
    color: '#2A2922',
    fontWeight: '500',
  }
});

export default DesignIdea;