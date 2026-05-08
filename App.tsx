import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from 'react-native';

interface Supplier {
  id: string;
  name: string;
  emissions: number;
  category: string;
  status: 'active' | 'optimizing' | 'compliant';
}

interface Goal {
  id: string;
  name: string;
  targetEmissions: number;
  deadline: string;
  progress: number;
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'company' | 'input' | 'dashboard'>('home');
  const [companyName, setCompanyName] = useState('');
  const [tempCompanyName, setTempCompanyName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmissions, setSupplierEmissions] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('Manufacturing');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('2026-12-31');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = ['Manufacturing', 'Logistics', 'Packaging', 'Energy', 'Other'];

  const confirmCompanyName = () => {
    if (!tempCompanyName.trim()) {
      Alert.alert('Error', 'Please enter a company name');
      return;
    }
    setCompanyName(tempCompanyName);
    setTempCompanyName('');
    setScreen('input');
  };

  const addSupplier = () => {
    if (!supplierName || !supplierEmissions) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newSupplier: Supplier = {
      id: Math.random().toString(),
      name: supplierName,
      emissions: parseFloat(supplierEmissions),
      category: supplierCategory,
      status: 'active',
    };

    setSuppliers([...suppliers, newSupplier]);
    setSupplierName('');
    setSupplierEmissions('');
    setSupplierCategory('Manufacturing');
    Alert.alert('Success', `${supplierName} added!`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const addGoal = () => {
    if (!goalName || !goalTarget) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newGoal: Goal = {
      id: Math.random().toString(),
      name: goalName,
      targetEmissions: parseFloat(goalTarget),
      deadline: goalDeadline,
      progress: 0,
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setGoalTarget('');
    setModalVisible(false);
    Alert.alert('Success', `Goal "${goalName}" created!`);
  };

  const optimizeSupplier = (id: string) => {
    setSuppliers(suppliers.map(s => 
      s.id === id ? { ...s, status: 'optimizing' as const, emissions: s.emissions * 0.8 } : s
    ));
    Alert.alert('Optimization', 'Supplier marked for optimization. Estimated 20% reduction!');
  };

  const totalEmissions = suppliers.reduce((sum, s) => sum + s.emissions, 0);
  const targetReduction = totalEmissions * 0.2;
  const topPolluter = suppliers.length > 0
    ? suppliers.reduce((max, s) => s.emissions > max.emissions ? s : max)
    : null;

  const getSortedSuppliers = () => {
    let filtered = [...suppliers];
    if (filterCategory) {
      filtered = filtered.filter(s => s.category === filterCategory);
    }
    return filtered.sort((a, b) => b.emissions - a.emissions);
  };

  const getEmissionsByCategory = () => {
    const byCategory: { [key: string]: number } = {};
    suppliers.forEach(s => {
      byCategory[s.category] = (byCategory[s.category] || 0) + s.emissions;
    });
    return byCategory;
  };

  const getCarbonScore = () => {
    if (suppliers.length === 0) return 100;
    const avgEmissions = totalEmissions / suppliers.length;
    return Math.max(0, 100 - (avgEmissions / 100));
  };

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌍 CarbonChain Pro</Text>
          <Text style={styles.subtitle}>Enterprise Carbon Management</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Advanced Features</Text>
            <Text style={styles.cardText}>✅ Real-time supplier tracking{'\n'}✅ Multi-category analysis{'\n'}✅ Goal management{'\n'}✅ Carbon scoring{'\n'}✅ Optimization recommendations{'\n'}✅ Detailed reporting</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 For Enterprises</Text>
            <Text style={styles.cardText}>Nike, Apple, Tesla use tools like this to meet ESG targets and reduce costs by millions.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Market Stats</Text>
            <Text style={styles.cardText}>$1 Trillion ESG Market • 2,000+ Fortune Companies • Growing 40% YoY</Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setTempCompanyName('');
            setSuppliers([]);
            setGoals([]);
            setScreen('company');
          }}
        >
          <Text style={styles.buttonText}>Start Now →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'company') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏢 Your Company</Text>
          <Text style={styles.subtitle}>Enter company details</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Nike Inc, Apple, Tesla"
              value={tempCompanyName}
              onChangeText={setTempCompanyName}
              editable={true}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={confirmCompanyName}
            >
              <Text style={styles.buttonText}>Continue →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => setScreen('home')}
            >
              <Text style={styles.buttonText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (screen === 'input') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 {companyName}</Text>
          <Text style={styles.subtitle}>Add your suppliers</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Add Suppliers</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Supplier Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Samsung Electronics"
            value={supplierName}
            onChangeText={setSupplierName}
          />

          <Text style={styles.label}>CO2 Emissions (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10000"
            value={supplierEmissions}
            onChangeText={setSupplierEmissions}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryBtn,
                  supplierCategory === cat && styles.categoryBtnActive,
                ]}
                onPress={() => setSupplierCategory(cat)}
              >
                <Text style={supplierCategory === cat ? styles.categoryTextActive : styles.categoryText}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.button}
            onPress={addSupplier}
          >
            <Text style={styles.buttonText}>+ Add Supplier</Text>
          </TouchableOpacity>

          {suppliers.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.successButton]}
              onPress={() => setScreen('dashboard')}
            >
              <Text style={styles.buttonText}>View Dashboard →</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Suppliers: {suppliers.length}</Text>
          {getSortedSuppliers().map((supplier) => (
            <View key={supplier.id} style={styles.supplierCard}>
              <View style={styles.supplierHeader}>
                <View style={styles.supplierInfo}>
                  <Text style={styles.supplierName}>{supplier.name}</Text>
                  <Text style={styles.supplierCategory}>{supplier.category}</Text>
                </View>
                <Text style={styles.supplierEmissions}>{supplier.emissions.toLocaleString()} kg</Text>
              </View>
              <View style={styles.supplierActions}>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.optimizeBtn]}
                  onPress={() => optimizeSupplier(supplier.id)}
                >
                  <Text style={styles.smallBtnText}>⚡ Optimize</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallBtn, styles.deleteBtn]}
                  onPress={() => deleteSupplier(supplier.id)}
                >
                  <Text style={styles.smallBtnText}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => setScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'dashboard') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 {companyName}</Text>
          <Text style={styles.subtitle}>Real-time Carbon Analysis</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Carbon Score Card */}
          <View style={[styles.statCard, styles.scoreCard]}>
            <Text style={styles.scoreLabel}>Carbon Score</Text>
            <Text style={styles.scoreValue}>{getCarbonScore().toFixed(0)}/100</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${getCarbonScore()}%` }]} />
            </View>
            <Text style={styles.scoreText}>
              {getCarbonScore() > 80 ? '✅ Excellent' : getCarbonScore() > 60 ? '⚠️ Good' : '🔴 Needs Work'}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{totalEmissions.toLocaleString()}</Text>
              <Text style={styles.statUnit}>kg CO2</Text>
            </View>
            <View style={[styles.statCard, styles.statCardSecondary]}>
              <Text style={styles.statLabel}>Target 20%</Text>
              <Text style={styles.statValue}>{targetReduction.toLocaleString()}</Text>
              <Text style={styles.statUnit}>kg CO2</Text>
            </View>
          </View>

          {/* Category Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 By Category</Text>
            {Object.entries(getEmissionsByCategory()).map(([category, emissions]) => {
              const percentage = ((emissions / totalEmissions) * 100).toFixed(1);
              return (
                <View key={category} style={styles.categoryBreakdown}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.categoryValue}>{percentage}%</Text>
                </View>
              );
            })}
          </View>

          {/* Top Polluter */}
          {topPolluter && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚨 Critical: Top Polluter</Text>
              <Text style={styles.topPolluerName}>{topPolluter.name}</Text>
              <Text style={styles.topPolluterEmissions}>
                {topPolluter.emissions.toLocaleString()} kg CO2 ({((topPolluter.emissions / totalEmissions) * 100).toFixed(1)}%)
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => optimizeSupplier(topPolluter.id)}
              >
                <Text style={styles.actionButtonText}>⚡ Optimize This Supplier</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Supplier Rankings */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>📋 All Suppliers</Text>
              {filterCategory && (
                <TouchableOpacity onPress={() => setFilterCategory(null)}>
                  <Text style={styles.clearFilter}>Clear Filter ✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {getSortedSuppliers().map((supplier, index) => {
              const percentage = ((supplier.emissions / totalEmissions) * 100).toFixed(1);
              return (
                <View key={supplier.id} style={styles.rankingRow}>
                  <Text style={styles.rankingRank}>#{index + 1}</Text>
                  <View style={styles.rankingInfo}>
                    <Text style={styles.rankingName}>{supplier.name}</Text>
                    <Text style={styles.rankingCategory}>{supplier.category}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.rankingValue}>{percentage}%</Text>
                </View>
              );
            })}
          </View>

          {/* Goals Section */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>🎯 Goals ({goals.length})</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.addGoalBtn}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {goals.length === 0 ? (
              <Text style={styles.noGoalsText}>No goals yet. Create one to track progress!</Text>
            ) : (
              goals.map(goal => (
                <View key={goal.id} style={styles.goalCard}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDeadline}>Deadline: {goal.deadline}</Text>
                  <Text style={styles.goalTarget}>Target: {goal.targetEmissions.toLocaleString()} kg</Text>
                </View>
              ))
            )}
          </View>

          {/* Recommendations */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Recommendations</Text>
            <Text style={styles.recommendationText}>
              {topPolluter
                ? `1. Focus on ${topPolluter.name} - they account for ${((topPolluter.emissions / totalEmissions) * 100).toFixed(0)}% of emissions\n\n2. A 20% reduction would save ${targetReduction.toLocaleString()} kg CO2\n\n3. Consider supplier diversification to reduce concentrated risk`
                : 'Add suppliers to get recommendations'}
            </Text>
          </View>
        </ScrollView>

        {/* Modal for adding goals */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.label}>Goal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 20% Emissions Reduction"
                value={goalName}
                onChangeText={setGoalName}
              />

              <Text style={styles.label}>Target Emissions (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 24000"
                value={goalTarget}
                onChangeText={setGoalTarget}
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Deadline</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={goalDeadline}
                onChangeText={setGoalDeadline}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={addGoal}
              >
                <Text style={styles.buttonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Navigation Tabs */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setScreen('dashboard')}
          >
            <Text style={styles.navBtnActive}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setScreen('input')}
          >
            <Text style={styles.navBtnText}>+ Suppliers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setScreen('home')}
          >
            <Text style={styles.navBtnText}>← Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default return
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 CarbonChain</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#dcfce7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#059669',
  },
  backButton: {
    backgroundColor: '#6b7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabActive: {
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#16a34a',
  },
  tabTextActive: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#16a34a',
  },
  categoryText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  supplierCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  supplierCategory: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  supplierEmissions: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  supplierActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  optimizeBtn: {
    backgroundColor: '#fbbf24',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
  },
  smallBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: '#16a34a',
  },
  statCardSecondary: {
    backgroundColor: '#059669',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginVertical: 8,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
  },
  scoreText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff80',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  statUnit: {
    fontSize: 11,
    color: '#ffffff80',
  },
  categoryBreakdown: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
  categoryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    textAlign: 'right',
  },
  topPolluerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  topPolluterEmissions: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#78350f',
    fontSize: 14,
    fontWeight: '600',
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankingRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    width: 30,
  },
  rankingInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  rankingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  rankingCategory: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  rankingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    width: 40,
    textAlign: 'right',
  },
  goalCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
  },
  goalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  goalDeadline: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  goalTarget: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
    fontWeight: '600',
  },
  noGoalsText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  addGoalBtn: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
  },
  clearFilter: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  navBtnActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalContent: {
    padding: 20,
  },
});
