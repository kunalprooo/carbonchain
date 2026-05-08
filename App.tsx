import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, FlatList } from 'react-native';

interface Supplier {
  id: string;
  name: string;
  emissions: number;
  category: string;
  status: 'active' | 'optimizing' | 'compliant';
  compliance: number;
  costSavings: number;
}

interface Goal {
  id: string;
  name: string;
  targetEmissions: number;
  deadline: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed';
}

interface Report {
  id: string;
  month: string;
  totalEmissions: number;
  reduction: number;
  costSaved: number;
}

interface Alert_Item {
  id: string;
  type: 'warning' | 'success' | 'info';
  message: string;
  timestamp: string;
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'company' | 'input' | 'dashboard' | 'reports' | 'settings' | 'benchmarks' | 'alerts'>('home');
  const [companyName, setCompanyName] = useState('Nike Inc');
  const [tempCompanyName, setTempCompanyName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmissions, setSupplierEmissions] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('Manufacturing');
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'Samsung Electronics', emissions: 12500, category: 'Manufacturing', status: 'active', compliance: 85, costSavings: 450000 },
    { id: '2', name: 'TSMC', emissions: 9800, category: 'Manufacturing', status: 'active', compliance: 92, costSavings: 320000 },
    { id: '3', name: 'Foxconn', emissions: 11200, category: 'Manufacturing', status: 'active', compliance: 78, costSavings: 380000 },
    { id: '4', name: 'DHL Logistics', emissions: 8500, category: 'Logistics', status: 'optimizing', compliance: 88, costSavings: 280000 },
    { id: '5', name: 'Sealed Air Corp', emissions: 6300, category: 'Packaging', status: 'compliant', compliance: 95, costSavings: 210000 },
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: '2026 Carbon Neutral', targetEmissions: 35000, deadline: '2026-12-31', progress: 35, status: 'on-track' },
    { id: '2', name: 'Supply Chain Optimization', targetEmissions: 40000, deadline: '2026-06-30', progress: 62, status: 'on-track' },
  ]);
  const [reports, setReports] = useState<Report[]>([
    { id: '1', month: 'May 2026', totalEmissions: 48300, reduction: 8, costSaved: 1640000 },
    { id: '2', month: 'April 2026', totalEmissions: 52400, reduction: 5, costSaved: 1420000 },
    { id: '3', month: 'March 2026', totalEmissions: 55100, reduction: 3, costSaved: 1180000 },
  ]);
  const [alerts, setAlerts] = useState<Alert_Item[]>([
    { id: '1', type: 'warning', message: 'Samsung emissions increased 12% this month', timestamp: '2 hours ago' },
    { id: '2', type: 'success', message: 'TSMC achieved 92% compliance rating', timestamp: '5 hours ago' },
    { id: '3', type: 'info', message: 'New ESG regulation effective June 1st', timestamp: '1 day ago' },
  ]);
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
      compliance: Math.floor(Math.random() * 30 + 70),
      costSavings: Math.floor(parseFloat(supplierEmissions) * 25),
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
      progress: Math.floor(Math.random() * 100),
      status: 'on-track',
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setGoalTarget('');
    setModalVisible(false);
    Alert.alert('Success', `Goal "${goalName}" created!`);
  };

  const optimizeSupplier = (id: string) => {
    setSuppliers(suppliers.map(s => 
      s.id === id ? { ...s, status: 'optimizing' as const, emissions: s.emissions * 0.8, costSavings: s.costSavings * 1.3 } : s
    ));
    Alert.alert('Optimization', 'Supplier marked for optimization. Estimated 20% reduction!');
  };

  const totalEmissions = suppliers.reduce((sum, s) => sum + s.emissions, 0);
  const totalCostSavings = suppliers.reduce((sum, s) => sum + s.costSavings, 0);
  const avgCompliance = suppliers.length > 0 ? Math.floor(suppliers.reduce((sum, s) => sum + s.compliance, 0) / suppliers.length) : 0;
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

  const getComplianceScore = () => avgCompliance;

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌍 CarbonChain Pro</Text>
          <Text style={styles.subtitle}>Enterprise Carbon Management</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Complete Enterprise Suite</Text>
            <Text style={styles.cardText}>
✅ Real-time supplier tracking{'\n'}
✅ Multi-category analysis{'\n'}
✅ Goal management & tracking{'\n'}
✅ Carbon scoring system{'\n'}
✅ Compliance monitoring{'\n'}
✅ Cost savings calculator{'\n'}
✅ Historical reports{'\n'}
✅ Industry benchmarks{'\n'}
✅ Alert system{'\n'}
✅ ESG reporting
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Financial Impact</Text>
            <Text style={styles.cardText}>Average Cost Savings: $250K-$500K per supplier{'\n'}ROI: 300-400% in first year{'\n'}Compliance Risk Reduction: 85%</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 For Fortune 500</Text>
            <Text style={styles.cardText}>Nike • Apple • Tesla • Microsoft • Google - all use ESG tools to meet sustainability targets</Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen('dashboard')}
        >
          <Text style={styles.buttonText}>View Demo Dashboard →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'dashboard') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 {companyName}</Text>
          <Text style={styles.subtitle}>Enterprise Dashboard</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Top KPIs */}
          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, styles.kpiPrimary]}>
              <Text style={styles.kpiLabel}>Carbon Score</Text>
              <Text style={styles.kpiValue}>{getCarbonScore().toFixed(0)}</Text>
              <Text style={styles.kpiUnit}>/100</Text>
            </View>
            <View style={[styles.kpiCard, styles.kpiSuccess]}>
              <Text style={styles.kpiLabel}>Compliance</Text>
              <Text style={styles.kpiValue}>{getComplianceScore()}</Text>
              <Text style={styles.kpiUnit}>%</Text>
            </View>
            <View style={[styles.kpiCard, styles.kpiWarning]}>
              <Text style={styles.kpiLabel}>Cost Saved</Text>
              <Text style={styles.kpiValue}>${(totalCostSavings / 1000000).toFixed(1)}M</Text>
              <Text style={styles.kpiUnit}>annually</Text>
            </View>
          </View>

          {/* Emissions Overview */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 Emissions Overview</Text>
            <View style={styles.emissionsSummary}>
              <View style={styles.emissionItem}>
                <Text style={styles.emissionLabel}>Total Emissions</Text>
                <Text style={styles.emissionValue}>{totalEmissions.toLocaleString()}</Text>
                <Text style={styles.emissionUnit}>kg CO2</Text>
              </View>
              <View style={styles.emissionItem}>
                <Text style={styles.emissionLabel}>20% Target</Text>
                <Text style={styles.emissionValue}>{targetReduction.toLocaleString()}</Text>
                <Text style={styles.emissionUnit}>kg CO2</Text>
              </View>
              <View style={styles.emissionItem}>
                <Text style={styles.emissionLabel}>Suppliers</Text>
                <Text style={styles.emissionValue}>{suppliers.length}</Text>
                <Text style={styles.emissionUnit}>tracked</Text>
              </View>
            </View>
          </View>

          {/* Goals Progress */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>🎯 Goals ({goals.length})</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.addBtn}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {goals.map(goal => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalDeadline}>Due: {goal.deadline}</Text>
                  </View>
                  <Text style={[styles.goalStatus, { color: goal.status === 'on-track' ? '#10b981' : '#ef4444' }]}>
                    {goal.status === 'on-track' ? '✓ On Track' : '⚠ At Risk'}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{goal.progress}% Complete</Text>
              </View>
            ))}
          </View>

          {/* Alerts */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>🔔 Alerts</Text>
              <Text style={styles.alertCount}>{alerts.length}</Text>
            </View>
            {alerts.map(alert => (
              <View key={alert.id} style={[styles.alertItem, { borderLeftColor: alert.type === 'warning' ? '#f59e0b' : alert.type === 'success' ? '#10b981' : '#3b82f6' }]}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.timestamp}</Text>
              </View>
            ))}
          </View>

          {/* Category Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 By Category</Text>
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
              <Text style={styles.cardTitle}>🚨 Top Polluter</Text>
              <View style={styles.topPolluerCard}>
                <View>
                  <Text style={styles.topPolluerName}>{topPolluter.name}</Text>
                  <Text style={styles.topPolluterCategory}>{topPolluter.category}</Text>
                </View>
                <Text style={styles.topPolluterEmissions}>{topPolluter.emissions.toLocaleString()} kg</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => optimizeSupplier(topPolluter.id)}
              >
                <Text style={styles.actionButtonText}>⚡ Optimize Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Supplier Rankings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Supplier Rankings</Text>
            {getSortedSuppliers().slice(0, 5).map((supplier, index) => {
              const percentage = ((supplier.emissions / totalEmissions) * 100).toFixed(1);
              return (
                <View key={supplier.id} style={styles.rankingRow}>
                  <View style={styles.rankingRank}>
                    <Text style={styles.rankingRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.rankingInfo}>
                    <Text style={styles.rankingName}>{supplier.name}</Text>
                    <View style={styles.rankingMeta}>
                      <Text style={styles.rankingCategory}>{supplier.category}</Text>
                      <Text style={styles.rankingCompliance}>Compliance: {supplier.compliance}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <Text style={styles.rankingValue}>{percentage}%</Text>
                    <Text style={styles.rankingEmissions}>{supplier.emissions.toLocaleString()} kg</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Recommendations */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 AI Recommendations</Text>
            <Text style={styles.recommendationText}>
{topPolluter
                ? `1️⃣ URGENT: Focus on ${topPolluter.name}\n→ ${((topPolluter.emissions / totalEmissions) * 100).toFixed(0)}% of total emissions\n→ Potential savings: $${(topPolluter.emissions * 25 * 0.3 / 1000).toFixed(0)}K\n\n2️⃣ Supply Chain Optimization\n→ A 20% reduction would save ${targetReduction.toLocaleString()} kg CO2\n→ Estimated annual cost savings: $${(targetReduction * 25 / 1000000).toFixed(1)}M\n\n3️⃣ Compliance Growth\n→ Current avg compliance: ${getComplianceScore()}%\n→ Target: 95% (Fortune 500 avg)\n→ Action: Implement tier-1 supplier audits`
                : 'Add suppliers to get recommendations'}
            </Text>
          </View>
        </ScrollView>

        {/* Modal for goals */}
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Goal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Goal Name</Text>
              <TextInput style={styles.input} placeholder="e.g., 30% Reduction by Q4" value={goalName} onChangeText={setGoalName} />
              <Text style={styles.label}>Target Emissions (kg)</Text>
              <TextInput style={styles.input} placeholder="e.g., 35000" value={goalTarget} onChangeText={setGoalTarget} keyboardType="decimal-pad" />
              <Text style={styles.label}>Deadline</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={goalDeadline} onChangeText={setGoalDeadline} />
              <TouchableOpacity style={styles.button} onPress={addGoal}>
                <Text style={styles.buttonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('dashboard')}>
            <Text style={styles.navBtnActive}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('reports')}>
            <Text style={styles.navBtnText}>📈 Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('benchmarks')}>
            <Text style={styles.navBtnText}>📊 Benchmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('settings')}>
            <Text style={styles.navBtnText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'reports') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📈 Reports</Text>
          <Text style={styles.subtitle}>Historical Data & Analytics</Text>
        </View>

        <ScrollView style={styles.content}>
          {reports.map(report => (
            <View key={report.id} style={styles.card}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportMonth}>{report.month}</Text>
                <View style={styles.reportBadge}>
                  <Text style={styles.reportReduction}>↓ {report.reduction}%</Text>
                </View>
              </View>
              <View style={styles.reportStats}>
                <View style={styles.reportStat}>
                  <Text style={styles.reportLabel}>Total Emissions</Text>
                  <Text style={styles.reportValue}>{report.totalEmissions.toLocaleString()} kg</Text>
                </View>
                <View style={styles.reportStat}>
                  <Text style={styles.reportLabel}>Cost Saved</Text>
                  <Text style={styles.reportValue}>${(report.costSaved / 1000000).toFixed(1)}M</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('dashboard')}>
            <Text style={styles.navBtnText}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('reports')}>
            <Text style={styles.navBtnActive}>📈 Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('benchmarks')}>
            <Text style={styles.navBtnText}>📊 Benchmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('settings')}>
            <Text style={styles.navBtnText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'benchmarks') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Industry Benchmarks</Text>
          <Text style={styles.subtitle}>How You Compare</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Performance vs Industry</Text>
            <View style={styles.benchmarkRow}>
              <Text style={styles.benchmarkLabel}>Your Emissions</Text>
              <View style={styles.benchmarkBars}>
                <View style={[styles.benchmarkBar, { width: '75%', backgroundColor: '#10b981' }]} />
              </View>
              <Text style={styles.benchmarkValue}>{totalEmissions.toLocaleString()} kg</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <Text style={styles.benchmarkLabel}>Industry Avg</Text>
              <View style={styles.benchmarkBars}>
                <View style={[styles.benchmarkBar, { width: '100%', backgroundColor: '#ef4444' }]} />
              </View>
              <Text style={styles.benchmarkValue}>{(totalEmissions * 1.3).toLocaleString()} kg</Text>
            </View>
            <View style={styles.benchmarkRow}>
              <Text style={styles.benchmarkLabel}>Top Performer</Text>
              <View style={styles.benchmarkBars}>
                <View style={[styles.benchmarkBar, { width: '40%', backgroundColor: '#3b82f6' }]} />
              </View>
              <Text style={styles.benchmarkValue}>{(totalEmissions * 0.4).toLocaleString()} kg</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏆 Performance Ranking</Text>
            <Text style={styles.benchmarkText}>Your Company: Rank #47 out of 500 peers</Text>
            <Text style={styles.benchmarkText}>Your Compliance: Rank #12 out of 500 peers</Text>
            <Text style={styles.benchmarkText}>Cost Efficiency: Rank #8 out of 500 peers</Text>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('dashboard')}>
            <Text style={styles.navBtnText}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('reports')}>
            <Text style={styles.navBtnText}>📈 Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('benchmarks')}>
            <Text style={styles.navBtnActive}>📊 Benchmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('settings')}>
            <Text style={styles.navBtnText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'settings') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚙️ Settings</Text>
          <Text style={styles.subtitle}>Configuration & Preferences</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Company Settings</Text>
            <TouchableOpacity style={styles.settingItem} onPress={() => setScreen('company')}>
              <Text style={styles.settingLabel}>Edit Company Name</Text>
              <Text style={styles.settingValue}>{companyName}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Integration</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Connect ERP System</Text>
              <Text style={styles.settingStatus}>Not Connected</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>ESG Reporting API</Text>
              <Text style={styles.settingStatus}>Active</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email Alerts</Text>
              <Text style={styles.settingStatus}>Enabled</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingLabel}>Weekly Reports</Text>
              <Text style={styles.settingStatus}>Enabled</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setScreen('home')}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('dashboard')}>
            <Text style={styles.navBtnText}>📊 Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('reports')}>
            <Text style={styles.navBtnText}>📈 Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('benchmarks')}>
            <Text style={styles.navBtnText}>📊 Benchmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setScreen('settings')}>
            <Text style={styles.navBtnActive}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 CarbonChain</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4' },
  header: { backgroundColor: '#16a34a', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#dcfce7' },
  content: { flex: 1, padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#16a34a' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  button: { backgroundColor: '#16a34a', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 },
  input: { borderWidth: 2, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, backgroundColor: 'white' },
  kpiGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kpiCard: { flex: 1, borderRadius: 12, padding: 16, marginHorizontal: 6, alignItems: 'center' },
  kpiPrimary: { backgroundColor: '#16a34a' },
  kpiSuccess: { backgroundColor: '#10b981' },
  kpiWarning: { backgroundColor: '#f59e0b' },
  kpiLabel: { fontSize: 12, color: '#ffffff80', fontWeight: '600' },
  kpiValue: { fontSize: 28, fontWeight: 'bold', color: 'white', marginVertical: 4 },
  kpiUnit: { fontSize: 11, color: '#ffffff80' },
  emissionsSummary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  emissionItem: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  emissionLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  emissionValue: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },
  emissionUnit: { fontSize: 11, color: '#9ca3af' },
  goalCard: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#06b6d4' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  goalDeadline: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  goalStatus: { fontSize: 12, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: '#16a34a' },
  progressText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  alertCount: { backgroundColor: '#ef4444', color: 'white', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, fontSize: 12, fontWeight: '600' },
  alertItem: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 3 },
  alertMessage: { fontSize: 14, color: '#1f2937', fontWeight: '500' },
  alertTime: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  categoryBreakdown: { marginBottom: 12 },
  categoryLabel: { fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  categoryValue: { fontSize: 12, fontWeight: '600', color: '#16a34a', textAlign: 'right' },
  topPolluerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  topPolluerName: { fontSize: 18, fontWeight: 'bold', color: '#ef4444' },
  topPolluterCategory: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  topPolluterEmissions: { fontSize: 16, fontWeight: '600', color: '#ef4444' },
  actionButton: { backgroundColor: '#fbbf24', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  actionButtonText: { color: '#78350f', fontSize: 14, fontWeight: '600' },
  rankingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rankingRank: { width: 35, height: 35, borderRadius: 50, backgroundColor: '#16a34a', justifyContent: 'center', alignItems: 'center' },
  rankingRankText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  rankingInfo: { flex: 1, marginLeft: 12 },
  rankingName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  rankingMeta: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginVertical: 2 },
  rankingCategory: { color: '#9ca3af' },
  rankingCompliance: { color: '#9ca3af' },
  rankingRight: { alignItems: 'flex-end' },
  rankingValue: { fontSize: 14, fontWeight: '600', color: '#16a34a' },
  rankingEmissions: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  recommendationText: { fontSize: 14, color: '#6b7280', lineHeight: 22 },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 8 },
  navBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  navBtnActive: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  navBtnText: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
  modalContainer: { flex: 1, backgroundColor: '#f0fdf4', paddingTop: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  modalClose: { fontSize: 24, color: '#6b7280' },
  modalContent: { padding: 20 },
  addBtn: { color: '#16a34a', fontSize: 12, fontWeight: '600' },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reportMonth: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  reportBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reportReduction: { color: '#16a34a', fontWeight: '600', fontSize: 12 },
  reportStats: { flexDirection: 'row', justifyContent: 'space-between' },
  reportStat: { flex: 1 },
  reportLabel: { fontSize: 12, color: '#9ca3af' },
  reportValue: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', marginTop: 4 },
  benchmarkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  benchmarkLabel: { width: 100, fontSize: 12, fontWeight: '600', color: '#1f2937' },
  benchmarkBars: { flex: 1, marginHorizontal: 8 },
  benchmarkBar: { height: 8, borderRadius: 4 },
  benchmarkValue: { width: 80, fontSize: 12, fontWeight: '600', color: '#1f2937', textAlign: 'right' },
  benchmarkText: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  settingItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  settingValue: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  settingStatus: { fontSize: 12, color: '#10b981', fontWeight: '600', marginTop: 4 },
});
