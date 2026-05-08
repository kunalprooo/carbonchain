import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

interface Supplier {
  id: string;
  name: string;
  emissions: number;
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'input' | 'dashboard'>('home');
  const [companyName, setCompanyName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmissions, setSupplierEmissions] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const addSupplier = () => {
    if (!supplierName || !supplierEmissions) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newSupplier: Supplier = {
      id: Math.random().toString(),
      name: supplierName,
      emissions: parseFloat(supplierEmissions),
    };

    setSuppliers([...suppliers, newSupplier]);
    setSupplierName('');
    setSupplierEmissions('');
    Alert.alert('Success', `${supplierName} added!`);
  };

  const totalEmissions = suppliers.reduce((sum, s) => sum + s.emissions, 0);
  const targetReduction = totalEmissions * 0.2;
  const topPolluter = suppliers.length > 0
    ? suppliers.reduce((max, s) => s.emissions > max.emissions ? s : max)
    : null;

  const getSortedSuppliers = () => {
    return [...suppliers].sort((a, b) => b.emissions - a.emissions);
  };

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌍 CarbonChain</Text>
          <Text style={styles.subtitle}>Supply Chain Carbon Tracker</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 What We Do</Text>
            <Text style={styles.cardText}>Track supplier emissions in real-time and identify your biggest polluters.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Market Impact</Text>
            <Text style={styles.cardText}>$1 Trillion ESG Compliance Market. Nike, Apple, Tesla need this.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚡ Features</Text>
            <Text style={styles.cardText}>✅ Add unlimited suppliers{'\n'}✅ Real-time calculations{'\n'}✅ Top polluter detection{'\n'}✅ 20% reduction targets</Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCompanyName('');
            setSuppliers([]);
            setScreen('input');
          }}
        >
          <Text style={styles.buttonText}>Start Tracking →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'input') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📝 Add Company</Text>
          <Text style={styles.subtitle}>{companyName || 'Enter company details'}</Text>
        </View>

        <ScrollView style={styles.content}>
          {!companyName && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Nike"
                value={companyName}
                onChangeText={setCompanyName}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (companyName.trim()) {
                    // Continue with suppliers
                  }
                }}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </View>
          )}

          {companyName && (
            <View>
              <Text style={styles.label}>Add Supplier</Text>
              <TextInput
                style={styles.input}
                placeholder="Supplier name (e.g., Samsung)"
                value={supplierName}
                onChangeText={setSupplierName}
              />
              <TextInput
                style={styles.input}
                placeholder="CO2 Emissions (kg)"
                value={supplierEmissions}
                onChangeText={setSupplierEmissions}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={addSupplier}
              >
                <Text style={styles.buttonText}>Add Supplier</Text>
              </TouchableOpacity>

              {suppliers.length > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setScreen('dashboard')}
                >
                  <Text style={styles.buttonText}>View Dashboard →</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.sectionTitle}>Suppliers Added: {suppliers.length}</Text>
              {suppliers.map((supplier) => (
                <View key={supplier.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{supplier.name}</Text>
                  <Text style={styles.cardText}>{supplier.emissions.toLocaleString()} kg CO2</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => setScreen('home')}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dashboard Screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 {companyName}</Text>
        <Text style={styles.subtitle}>Carbon Footprint Analysis</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statLabel}>Total Emissions</Text>
            <Text style={styles.statValue}>{totalEmissions.toLocaleString()}</Text>
            <Text style={styles.statUnit}>kg CO2</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={styles.statLabel}>20% Target</Text>
            <Text style={styles.statValue}>{targetReduction.toLocaleString()}</Text>
            <Text style={styles.statUnit}>kg CO2</Text>
          </View>
        </View>

        {topPolluter && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚨 Top Polluter</Text>
            <Text style={styles.cardText}>{topPolluter.name}</Text>
            <Text style={styles.cardText}>
              {topPolluter.emissions.toLocaleString()} kg CO2 ({((topPolluter.emissions / totalEmissions) * 100).toFixed(1)}%)
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Supplier Rankings</Text>
          {getSortedSuppliers().map((supplier, index) => {
            const percentage = ((supplier.emissions / totalEmissions) * 100).toFixed(1);
            return (
              <View key={supplier.id} style={styles.rankingRow}>
                <Text style={styles.rankingRank}>#{index + 1}</Text>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingName}>{supplier.name}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.rankingValue}>{percentage}%</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💡 Recommendation</Text>
          <Text style={styles.cardText}>
            {topPolluter
              ? `Focus on ${topPolluter.name}. Optimizing their process could save ${(targetReduction).toLocaleString()} kg CO2.`
              : 'Add suppliers to see recommendations'}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => setScreen('input')}
      >
        <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>
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
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
  secondaryButton: {
    backgroundColor: '#059669',
  },
  backButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#6b7280',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
  rankingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    width: 40,
    textAlign: 'right',
  },
});
