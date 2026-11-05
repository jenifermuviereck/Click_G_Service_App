import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import profileApi, { CatalogSkill } from '../../common/api/profileApi';
import showNotification from '../../common/utils/notification';

const DEFAULT_AVAILABLE_SKILLS = [
  'AC Repair',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Appliance Repair',
  'Deep Cleaning',
  'Pest Control',
];

const SkillsServicesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [availableSkills, setAvailableSkills] = useState<string[]>(DEFAULT_AVAILABLE_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [serviceAreaIds, setServiceAreaIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch current profile skills
        const profRes = await profileApi.getProfile();
        if (profRes.success && profRes.data) {
          const currentSkills = profRes.data.skills || [];
          setSelectedSkills(currentSkills);
          if (profRes.data.serviceAreaIds?.length) {
            setServiceAreaIds(profRes.data.serviceAreaIds);
          }
        }

        // 2. Fetch catalog skills from backend
        const catalogRes = await profileApi.getCatalogSkills();
        if (catalogRes.success && catalogRes.data && catalogRes.data.length > 0) {
          const names = catalogRes.data.map((s: CatalogSkill) => s.name);
          setAvailableSkills(Array.from(new Set([...names, ...DEFAULT_AVAILABLE_SKILLS])));
        }

        // 3. Fetch service areas if needed
        const areasRes = await profileApi.getCatalogServiceAreas();
        if (areasRes.success && areasRes.data && areasRes.data.length > 0) {
          setServiceAreaIds(areasRes.data.map((a: any) => a.id));
        }
      } catch (err) {
        console.warn('[SkillsServicesScreen] loadSkillsData error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill],
    );
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      showNotification('Please select at least one skill');
      return;
    }

    try {
      setIsSaving(true);
      const res = await profileApi.updateWorkSelection({
        skills: selectedSkills,
        serviceAreaIds: serviceAreaIds.length > 0 ? serviceAreaIds : ['43712e4a-17d0-49b3-946a-fcce65e865fb'],
      });

      if (res.success) {
        showNotification('Skills updated successfully');
        navigation.goBack();
      } else {
        showNotification(res.message || 'Failed to update skills. Try again.');
      }
    } catch (err) {
      console.warn('[SkillsServicesScreen] save error:', err);
      showNotification('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Skills &amp; Services</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#07522C" />
          <Text className="text-xs text-slate-500 mt-2">Loading skills catalog...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Info Card */}
          <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5">
            <View className="flex-row items-center mb-1">
              <Icon name="information-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
              <Text className="text-xs font-bold text-emerald-900">Job Matching Preference</Text>
            </View>
            <Text className="text-xs text-emerald-800 leading-relaxed">
              Select the service skills you are trained for. You will automatically receive customer job requests matching your active skills in your operational area.
            </Text>
          </View>

          {/* Selected Skills Count */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-900">Available Skills</Text>
            <View className="bg-brand-green/10 px-2.5 py-0.5 rounded-full">
              <Text className="text-xs font-bold text-brand-green">
                {selectedSkills.length} selected
              </Text>
            </View>
          </View>

          {/* Skill Grid */}
          <View className="flex-row flex-wrap gap-2.5 mb-6">
            {availableSkills.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  activeOpacity={0.75}
                  onPress={() => toggleSkill(skill)}
                  className={`flex-row items-center px-4 py-3 rounded-xl border ${
                    isSelected
                      ? 'bg-brand-green border-brand-green'
                      : 'bg-white border-slate-200'
                  }`}>
                  <Icon
                    name={isSelected ? 'check-circle' : 'plus-circle-outline'}
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`text-xs sm:text-sm font-semibold ${
                      isSelected ? 'text-white font-bold' : 'text-slate-700'
                    }`}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Floating Save Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <TouchableOpacity
          className="bg-brand-green h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.85}
          disabled={isSaving || isLoading}
          onPress={handleSave}>
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white text-sm sm:text-base font-bold">Save Skills &amp; Services</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SkillsServicesScreen;

